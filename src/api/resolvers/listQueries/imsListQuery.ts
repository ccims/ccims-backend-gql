import { GraphQLFieldConfig, GraphQLResolveInfo } from "graphql";
import { LoadIMSSystemsCommand } from "../../../common/database/commands/load/nodes/LoadIMSSystemsCommand";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { IMSSystem } from "../../../common/nodes/IMSSystem";
import { ListProperty } from "../../../common/nodes/properties/ListProperty";
import { ResolverContext } from "../../ResolverContext";
import GraphQLImsFilter from "../types/filters/GraphQLIMSFilter";
import GraphQLImsPage from "../types/pages/GraphQLIMSPage";
import nodeListQuery from "./nodeListQuery";

/**
 * Creates a imss query GraphQLFieldConfig including a resolver using the property provided by the property provider or the database manager in the context
 *
 * @param description The description text for the imss query
 * @param propertyProvider A provider function providing a property of the destination/node type from which to request the nodes when given a node of the source type
 * @returns A GraphQLFieldConfig with fields needed for a resolvable imss query
 */
function imsListQuery<TSource extends CCIMSNode, TProperty extends Partial<IMSSystem>>(
    description: string,
    propertyProvider?: (node: TSource) => ListProperty<CCIMSNode & TProperty>
): GraphQLFieldConfig<TSource, ResolverContext> {
    const baseQuery = nodeListQuery<TSource, IMSSystem>(GraphQLImsPage, GraphQLImsFilter, description, "IMS", propertyProvider);
    return {
        ...baseQuery,
        resolve: async (src: TSource, args: any, context: ResolverContext, info: GraphQLResolveInfo) => {
            const cmd = new LoadIMSSystemsCommand();
            baseQuery.addParams(cmd, args);
            cmd.components = args.filterBy?.components;
            cmd.imsComponents = args.filterBy?.ImsComponents;
            return baseQuery.createResult(src, context, cmd);
        }
    };
}
export default imsListQuery;