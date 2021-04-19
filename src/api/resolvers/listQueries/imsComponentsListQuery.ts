import { GraphQLFieldConfig, GraphQLResolveInfo } from "graphql";
import { LoadIMSComponentsCommand } from "../../../common/database/commands/load/nodes/LoadIMSComponentsCommand";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { IMSComponent } from "../../../common/nodes/IMSComponent";
import { ListProperty } from "../../../common/nodes/properties/ListProperty";
import { ResolverContext } from "../../ResolverContext";
import GraphQLIMSComponentFilter from "../types/filters/GraphQLIMSComponentFilter";
import GraphQLIMSComponentPage from "../types/pages/GraphQLIMSComponentPage";
import nodeListQuery from "./nodeListQuery";

/**
 * Creates a imss query GraphQLFieldConfig including a resolver using the property provided by the property provider or the database manager in the context
 *
 * @param description The description text for the imss query
 * @param propertyProvider A provider function providing a property of the destination/node type from which to request the nodes when given a node of the source type
 * @returns A GraphQLFieldConfig with fields needed for a resolvable imss query
 */
function imsComponentsListQuery<TSource extends CCIMSNode, TProperty extends Partial<IMSComponent>>(
    description: string,
    propertyProvider?: (node: TSource) => ListProperty<CCIMSNode & TProperty>
): GraphQLFieldConfig<TSource, ResolverContext> {
    const baseQuery = nodeListQuery<TSource, IMSComponent>(GraphQLIMSComponentPage, GraphQLIMSComponentFilter, description, "IMSComponents", propertyProvider);
    return {
        ...baseQuery,
        resolve: async (src: TSource, args: any, context: ResolverContext, info: GraphQLResolveInfo) => {
            const cmd = new LoadIMSComponentsCommand();
            baseQuery.addParams(cmd, args);
            cmd.components = args.filterBy?.components;
            cmd.imsSystems = args.filterBy?.ims;
            return baseQuery.createResult(src, context, cmd);
        }
    };
}
export default imsComponentsListQuery;