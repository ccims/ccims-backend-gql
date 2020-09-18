import { GraphQLObjectType, GraphQLFieldConfig, GraphQLInputObjectType } from "graphql";
import { ResolverContext } from "../../ResolverContext";
import { LoadNamedOwnedNodesCommand } from "../../../common/database/commands/load/nodes/LoadNamedOwnedNodesCommand";
import namedNodeListQuery from "./namedNodeListQuery";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { NamedOwnedNode } from "../../../common/nodes/NamedOwnedNode";
import { Page } from "../utils/Page";
import { NodeListProperty } from "../../../common/nodes/properties/NodeListProperty";

export default <TSource extends CCIMSNode, TNode extends NamedOwnedNode>(pageType: GraphQLObjectType, filterType: GraphQLInputObjectType, description: string, nodeNamePlural: string,
    propertyProvider?: (node: TSource) => NodeListProperty<TNode, TSource>):
    GraphQLFieldConfig<TSource, ResolverContext> &
    {
        addParams: (cmd: LoadNamedOwnedNodesCommand<TNode>, args: any) => any,
        createResult: (src: TSource, context: ResolverContext, cmd: LoadNamedOwnedNodesCommand<TNode>) => Promise<Page<TNode>>
    } => {
    const baseQuery = namedNodeListQuery<TSource, TNode>(pageType, filterType, description, nodeNamePlural, propertyProvider);
    return {
        ...baseQuery,
        addParams: (cmd: LoadNamedOwnedNodesCommand<TNode>, args: any) => {
            baseQuery.addParams(cmd, args);
            cmd.onOwners = args.filterBy?.owner;
        }
    };
};