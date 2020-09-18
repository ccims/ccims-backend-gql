import { GraphQLFieldConfig, GraphQLInputObjectType, GraphQLObjectType } from "graphql";
import { LoadNamedNodesCommand } from "../../../common/database/commands/load/nodes/LoadNamedNodeCommand";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { NamedNode } from "../../../common/nodes/NamedNode";
import { NodeListProperty } from "../../../common/nodes/properties/NodeListProperty";
import { ResolverContext } from "../../ResolverContext";
import { Page } from "../utils/Page";
import nodeListQuery from "./nodeListQuery";

export default <TSource extends CCIMSNode, TNode extends NamedNode>(pageType: GraphQLObjectType, filterType: GraphQLInputObjectType, description: string, nodeNamePlural: string,
    propertyProvider?: (node: TSource) => NodeListProperty<TNode, TSource>):
    GraphQLFieldConfig<TSource, ResolverContext> &
    {
        addParams: (cmd: LoadNamedNodesCommand<TNode>, args: any) => any,
        createResult: (src: TSource, context: ResolverContext, cmd: LoadNamedNodesCommand<TNode>) => Promise<Page<TNode>>
    } => {
    const baseQuery = nodeListQuery<TSource, TNode>(pageType, filterType, description, nodeNamePlural, propertyProvider);
    return {
        ...baseQuery,
        addParams: (cmd: LoadNamedNodesCommand<TNode>, args: any) => {
            baseQuery.addParams(cmd, args);
            cmd.name = args.filterBy?.name;
            cmd.description = args.filterBy?.description;
        }
    };
};