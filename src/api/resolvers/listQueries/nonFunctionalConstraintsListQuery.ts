import { GraphQLFieldConfig, GraphQLResolveInfo } from "graphql";
import { LoadNonFunctionalConstraintsCommand } from "../../../common/database/commands/load/nodes/LoadNonFunctionalConstraintsCommand";
import { NonFunctionalConstraint } from "../../../common/nodes/NonFunctionalConstraint";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { ListProperty } from "../../../common/nodes/properties/ListProperty";
import { ResolverContext } from "../../ResolverContext";
import GraphQLNonFunctionalConstraintFilter from "../types/filters/GraphQLNonFunctionalConstraintFilter";
import GraphQLNonFunctionalConstraintPage from "../types/pages/GraphQLNonFunctionalConstraintPage";
import syncNodesListQuery from "./syncNodesListQuery";

/**
 * Creates a NonFunctionalConstraints query GraphQLFieldConfig including a resolver using the property provided by the property provider or the database manager in the context
 *
 * @param description The description text for the NonFunctionalConstraints query
 * @param propertyProvider A provider function providing a property of the destination/node type from which to request the nodes when given a node of the source type
 * @returns A GraphQLFieldConfig with fields needed for a resolvable NonFunctionalConstraints query
 */
function nonFunctionalConstraintsListQuery<TSource extends CCIMSNode, TProperty extends Partial<NonFunctionalConstraint>>(
    description: string,
    propertyProvider?: (node: TSource) => ListProperty<TProperty & CCIMSNode>
): GraphQLFieldConfig<TSource, ResolverContext> {
    const baseQuery = syncNodesListQuery<TSource, NonFunctionalConstraint>(GraphQLNonFunctionalConstraintPage, GraphQLNonFunctionalConstraintFilter, description, "NonFunctionalConstraints", propertyProvider);
    return {
        ...baseQuery,
        resolve: async (src: TSource, args: any, context: ResolverContext, info: GraphQLResolveInfo) => {
            const cmd = new LoadNonFunctionalConstraintsCommand();
            baseQuery.addParams(cmd, args);
            cmd.description = args.filterBy?.description;
            cmd.content = args.filterBy?.content;
            cmd.isActive = args.filterBy?.isActive;
            return baseQuery.createResult(src, context, cmd);
        }
    };
}
export default nonFunctionalConstraintsListQuery;