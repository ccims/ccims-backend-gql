import { GraphQLFieldConfig, GraphQLInputObjectType, GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { LoadNodeListCommand } from "../../../common/database/commands/load/nodes/LoadNodeListCommand";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { ListProperty } from "../../../common/nodes/properties/ListProperty";
import { ResolverContext } from "../../ResolverContext";
import { Page } from "../utils/Page";

type nodeListQueryType<TSource extends CCIMSNode, TNode extends CCIMSNode> = GraphQLFieldConfig<TSource, ResolverContext> &
{
    /**
     * Adds the basic limiting parameters (first/last/after/before) into a given command
     * @param cmd The command into which to insert the limits given in the arguments in the second parameter
     * @param args The arguments containing the inputs from the GraphQL request. The needed fields of this will be inserted into the command
     */
    addParams: (cmd: LoadNodeListCommand<TNode>, args: any) => void,

    /**
     * Takes a command with all filters added, executes it and returns a page with the results
     *
     * The command is executed eiter directly on the database manager or on a property, depending on the given `propertyProvider`.
     * If the `propertyProvider` is `undefined` or returns `undefined`, a root query will be executed on the database manager.
     * If there a valid property is returned by the `propertyProvider`, the command will executed on the property
     *
     * @param src If not a root query - The source node on which the property is used and on which to execure the given property provider
     * @param context The `ResolverContext` object provided by the resolve function, containing a valid `dbManager`
     * @param cmd The command containing all the set filters to be executed
     */
    createResult: (src: TSource, context: ResolverContext, cmd: LoadNodeListCommand<TNode>) => Promise<Page<TNode>>
};

/**
 * Creates the base for a node list query for a GraphQL property.
 *
 * This contains the basic argument and type structure and logic for inserting the limiting parameters (before/after/first/last)
 * into the command and generating the resulting page from given command and arguments
 *
 * @param pageType The GraphQL Type of the Page which is returned for the query
 * @param filterType The type of the GraphQL filter to be used for the query
 * @param description The description text of the query
 * @param nodeNamePlural The name of the nodes to be requested, lowercase, plural, will be inserted into the arguments descriptions
 * @param propertyProvider A provider function providing a property of the destination/node type from which to request the nodes when given a node of the source type
 * @returns The base for a node list query (a `GraphQLFieldConfig` additional functionality)
 */
function nodeListQuery<TSource extends CCIMSNode, TNode extends CCIMSNode>(
    pageType: GraphQLObjectType,
    filterType: GraphQLInputObjectType,
    description: string,
    nodeNamePlural: string,
    propertyProvider?: (node: TSource) => ListProperty<Partial<TNode> & CCIMSNode>
): nodeListQueryType<TSource, TNode> {
    return {
        type: pageType,
        description,
        args: {
            after: {
                type: GraphQLString,
                description: `Returns only ${nodeNamePlural} AFTER one with the given cursor (exclusive)`
            },
            before: {
                type: GraphQLString,
                description: `Returns only ${nodeNamePlural} BEFORE the one with the given cursor (exclusive)`
            },
            filterBy: {
                type: filterType,
                description: `Only ${nodeNamePlural} matching this filter will be returned`
            },
            first: {
                type: GraphQLInt,
                description: `Only return the first _n_ ${nodeNamePlural} matching the filter`
            },
            last: {
                type: GraphQLInt,
                description: `Only return the last _n_ ${nodeNamePlural} matching the filter`
            }
        },
        addParams: (cmd: LoadNodeListCommand<TNode>, args: any) => {
            if (args) {
                cmd.afterId = args.after;
                cmd.beforeId = args.before;
                if (args.first) {
                    cmd.first = true;
                    cmd.limit = args.first;
                } else if (args.last) {
                    cmd.first = false;
                    cmd.limit = args.last;
                }
            }
        },
        createResult: async (src: TSource, context: ResolverContext, cmd: LoadNodeListCommand<TNode>): Promise<Page<TNode>> => {
            let result: TNode[];
            if (propertyProvider) {
                const property = propertyProvider(src);
                if (!property) {
                    context.dbManager.addCommand(cmd);
                    await context.dbManager.executePendingCommands();
                    result = cmd.getResult();
                } else {
                    result = await property.getFilteredElements(cmd);
                }
            } else {
                context.dbManager.addCommand(cmd);
                await context.dbManager.executePendingCommands();
                result = cmd.getResult();
            }
            return new Page(cmd.hasNext, cmd.hasPrevious, result, cmd, context.dbManager);
        }
    };
};

export default nodeListQuery;