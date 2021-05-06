import { GraphQLFieldConfig, GraphQLResolveInfo } from "graphql";
import { LoadArtifactsCommand } from "../../../common/database/commands/load/nodes/LoadArtifactsCommand";
import { Artifact } from "../../../common/nodes/Artifact";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { ListProperty } from "../../../common/nodes/properties/ListProperty";
import { ResolverContext } from "../../ResolverContext";
import GraphQLArtifactFilter from "../types/filters/GraphQLArtifactFilter";
import GraphQLArtifactPage from "../types/pages/GraphQLArtifactPage";
import syncNodesListQuery from "./syncNodesListQuery";

/**
 * Creates a Artifacts query GraphQLFieldConfig including a resolver using the property provided by the property provider or the database manager in the context
 *
 * @param description The description text for the Artifacts query
 * @param propertyProvider A provider function providing a property of the destination/node type from which to request the nodes when given a node of the source type
 * @returns A GraphQLFieldConfig with fields needed for a resolvable Artifacts query
 */
function artifactsListQuery<TSource extends CCIMSNode, TProperty extends Partial<Artifact>>(
    description: string,
    propertyProvider?: (node: TSource) => ListProperty<TProperty & CCIMSNode>
): GraphQLFieldConfig<TSource, ResolverContext> {
    const baseQuery = syncNodesListQuery<TSource, Artifact>(GraphQLArtifactPage, GraphQLArtifactFilter, description, "Artifacts", propertyProvider);
    return {
        ...baseQuery,
        resolve: async (src: TSource, args: any, context: ResolverContext, info: GraphQLResolveInfo) => {
            const cmd = new LoadArtifactsCommand();
            baseQuery.addParams(cmd, args);
            cmd.uri = args.filterBy?.uri;
            return baseQuery.createResult(src, context, cmd);
        }
    };
}
export default artifactsListQuery;