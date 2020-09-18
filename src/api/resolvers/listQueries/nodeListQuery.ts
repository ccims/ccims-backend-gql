import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLFieldConfig, GraphQLInputObjectType } from "graphql";
import { LoadNodeListCommand } from "../../../common/database/commands/load/nodes/LoadNodeListCommand";
import { ResolverContext } from "../../ResolverContext";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { NodeListProperty } from "../../../common/nodes/properties/NodeListProperty";
import { Page } from "../utils/Page";

export default <TSource extends CCIMSNode, TNode extends CCIMSNode>(pageType: GraphQLObjectType, filterType: GraphQLInputObjectType, description: string, nodeNamePlural: string,
    propertyProvider?: (node: TSource) => NodeListProperty<TNode, TSource>):
    GraphQLFieldConfig<TSource, ResolverContext> &
    {
        addParams: (cmd: LoadNodeListCommand<TNode>, args: any) => any,
        createResult: (src: TSource, context: ResolverContext, cmd: LoadNodeListCommand<TNode>) => Promise<Page<TNode>>
    } => {
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
            cmd.afterId = args.after;
            cmd.beforeId = args.before;
            if (args.first) {
                cmd.first = true;
                cmd.limit = args.first;
            } else if (args.last) {
                cmd.first = false;
                cmd.limit = args.first;
            }
        },
        createResult: async (src: TSource, context: ResolverContext, cmd: LoadNodeListCommand<TNode>): Promise<Page<TNode>> => {
            let result: TNode[];
            if (propertyProvider) {
                const property = propertyProvider(src);
                result = await property.getFilteredElements(cmd);
            } else {
                context.dbManager.addCommand(cmd);
                await context.dbManager.executePendingCommands();
                result = cmd.getResult();
            }
            return new Page(false, false, result, cmd);
        }
    };
};