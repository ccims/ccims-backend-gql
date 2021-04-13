import { GraphQLFieldConfig, GraphQLResolveInfo } from "graphql";
import GraphQLLabelPage from "../types/pages/GraphQLLabelPage";
import GraphQLLabelFilter from "../types/filters/GraphQLLabelFilter";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { Label } from "../../../common/nodes/Label";
import { ResolverContext } from "../../ResolverContext";
import namedSyncNodeListQuery from "./namedSyncNodesListQuery";
import { LoadLabelsCommand } from "../../../common/database/commands/load/nodes/LoadLabelsCommand";
import { ListProperty } from "../../../common/nodes/properties/ListProperty";

/**
 * Creates a labels query GraphQLFieldConfig including a resolver using the property provided by the property provider or the database manager in the context
 *
 * @param description The description text for the labels query
 * @param propertyProvider A provider function providing a property of the destination/node type from which to request the nodes when given a node of the source type
 * @returns A GraphQLFieldConfig with fields needed for a resolvable labels query
 */
function labelsListQuery<TSource extends CCIMSNode, TProperty extends Partial<Label>>(
    description: string,
    propertyProvider?: (node: TSource) => ListProperty<TProperty & CCIMSNode>
): GraphQLFieldConfig<TSource, ResolverContext> {
    const baseQuery = namedSyncNodeListQuery<TSource, Label>(GraphQLLabelPage, GraphQLLabelFilter, description, "Labels", propertyProvider);
    return {
        ...baseQuery,
        resolve: async (src: TSource, args: any, context: ResolverContext, info: GraphQLResolveInfo) => {
            const cmd = new LoadLabelsCommand();
            baseQuery.addParams(cmd, args);
            cmd.colors = args.filterBy?.color;
            return baseQuery.createResult(src, context, cmd);
        }
    };
}
export default labelsListQuery;