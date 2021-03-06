import { GraphQLObjectType, GraphQLFieldConfig, GraphQLInputObjectType } from "graphql";
import { ResolverContext } from "../../ResolverContext";
import { LoadNamedOwnedNodesCommand } from "../../../common/database/commands/load/nodes/LoadNamedOwnedNodesCommand";
import namedNodeListQuery from "./namedNodeListQuery";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { NamedOwnedNode } from "../../../common/nodes/NamedOwnedNode";
import { Page } from "../utils/Page";
import { NodeListProperty } from "../../../common/nodes/properties/NodeListProperty";
import { ListProperty } from "../../../common/nodes/properties/ListProperty";

type namedOwnedNodeListQueryType<TSource extends CCIMSNode, TNode extends NamedOwnedNode> = GraphQLFieldConfig<TSource, ResolverContext> &
{
    /**
     * Adds the basic limiting parameters (first/last/after/before) and the `name`, `description` and `owner` filter into a given command
     * @param cmd The command into which to insert the limits given in the arguments in the second parameter
     * @param args The arguments containing the inputs from the GraphQL request. The needed fields of this will be inserted into the command
     */
    addParams: (cmd: LoadNamedOwnedNodesCommand<TNode>, args: any) => void,

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
    createResult: (src: TSource, context: ResolverContext, cmd: LoadNamedOwnedNodesCommand<TNode>) => Promise<Page<TNode>>
};

/**
 * Creates the base for a node list query for a GraphQL property.
 *
 * This contains the basic argument and type structure and logic for inserting the limiting parameters (before/after/first/last)
 * as well as the `name`, `description` and `owner` filters
 * into the command and generating the resulting page from given command and arguments
 *
 * @param pageType The GraphQL Type of the Page which is returned for the query
 * @param filterType The type of the GraphQL filter to be used for the query
 * @param description The description text of the query
 * @param nodeNamePlural The name of the nodes to be requested, lowercase, plural, will be inserted into the arguments descriptions
 * @param propertyProvider A provider function providing a property of the destination/node type from which to request the nodes when given a node of the source type
 * @returns The base for a node list query (a `GraphQLFieldConfig` additional functionality)
 */
function namedOwnedNodeListQuery<TSource extends CCIMSNode, TNode extends NamedOwnedNode>(
    pageType: GraphQLObjectType,
    filterType: GraphQLInputObjectType,
    description: string,
    nodeNamePlural: string,
    propertyProvider?: (node: TSource) => ListProperty<Partial<TNode> & CCIMSNode>
): namedOwnedNodeListQueryType<TSource, TNode> {
    const baseQuery = namedNodeListQuery<TSource, TNode>(pageType, filterType, description, nodeNamePlural, propertyProvider);
    return {
        ...baseQuery,
        addParams: (cmd: LoadNamedOwnedNodesCommand<TNode>, args: any) => {
            baseQuery.addParams(cmd, args);
            cmd.ownedBy = args.filterBy?.owner;
        }
    };
};

export default namedOwnedNodeListQuery;