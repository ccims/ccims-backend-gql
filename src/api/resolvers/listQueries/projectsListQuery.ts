import { GraphQLFieldConfig, GraphQLResolveInfo } from "graphql";
import { LoadProjectsCommand } from "../../../common/database/commands/load/nodes/LoadProjectsCommand";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { Project } from "../../../common/nodes/Project";
import { ListProperty } from "../../../common/nodes/properties/ListProperty";
import { ResolverContext } from "../../ResolverContext";
import GraphQLProjectFilter from "../types/filters/GraphQLProjectFilter";
import GraphQLProjectPage from "../types/pages/GraphQLProjectPage";
import namedNodesListQuery from "./namedNodesListQuery";

/**
 * Creates a projects query GraphQLFieldConfig including a resolver using the property provided by the property provider or the database manager in the context
 *
 * @param description The description text for the projects query
 * @param propertyProvider A provider function providing a property of the destination/node type from which to request the nodes when given a node of the source type
 * @returns A GraphQLFieldConfig with fields needed for a resolvable projects query
 */
function projectsListQuery<TSource extends CCIMSNode, TProperty extends Partial<Project>>(
    description: string,
    propertyProvider?: (node: TSource) => ListProperty<TProperty & CCIMSNode>
): GraphQLFieldConfig<TSource, ResolverContext> {
    const baseQuery = namedNodesListQuery<TSource, Project>(GraphQLProjectPage, GraphQLProjectFilter, description, "projects", propertyProvider);
    return {
        ...baseQuery,
        resolve: async (src: TSource, args: any, context: ResolverContext, info: GraphQLResolveInfo) => {
            const cmd = new LoadProjectsCommand();
            baseQuery.addParams(cmd, args);
            cmd.components = args.filterBy?.components;
            cmd.users = args.filterBy?.users;
            cmd.issuesOnComponent = args.filterBy?.issues;
            return baseQuery.createResult(src, context, cmd);
        }
    };
}
export default projectsListQuery;