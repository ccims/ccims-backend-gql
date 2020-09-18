import { GraphQLFieldConfig, GraphQLResolveInfo } from "graphql";
import { LoadProjectsCommand } from "../../../common/database/commands/load/nodes/LoadProjectsCommand";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { Project } from "../../../common/nodes/Project";
import { NodeListProperty } from "../../../common/nodes/properties/NodeListProperty";
import { ResolverContext } from "../../ResolverContext";
import GraphQLProjectFilter from "../types/filters/GraphQLProjectFilter";
import GraphQLProjectPage from "../types/pages/GraphQLProjectPage";
import namedOwnedNodeListQuery from "./namedOwnedNodeListQuery";

/**
 * Creates a projects query GraphQLFieldConfig including a resolver using the property provided by the property provider or the database manager in the context
 * 
 * @param description The description text for the projects query
 * @param propertyProvider A provider function providing a property of the destination/node type from which to request the nodes when given a node of the source type
 * @returns A GraphQLFieldConfig with fields needed for a resolvable projects query
 */
function projectsListQuery<TSource extends CCIMSNode>(
    description: string,
    propertyProvider?: (node: TSource) => NodeListProperty<Project, TSource>
): GraphQLFieldConfig<TSource, ResolverContext> {
    const baseQuery = namedOwnedNodeListQuery<TSource, Project>(GraphQLProjectPage, GraphQLProjectFilter, description, "projects", propertyProvider);
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
};
export default projectsListQuery;

/*export default <TSource extends CCIMSNode>(propertyProvider?: (node: TSource) => NodeListProperty<Project, TSource>): GraphQLFieldConfig<TSource, ResolverContext> => {
    return {
        type: GraphQLProjectPage,
        description: "Requests projects within the given limits",
        args: {
            after: {
                type: GraphQLString,
                description: "Returns projects after the given edge"
            },
            before: {
                type: GraphQLString,
                description: "Returns projects before the given edge"
            },
            filterBy: {
                type: GraphQLProjectFilter,
                description: "Only projects matching this filter will be returned"
            },
            first: {
                type: GraphQLInt,
                description: "Only return the first _n_ projects in the system"
            },
            last: {
                type: GraphQLInt,
                description: "Only return the last _n_ projects in the system"
            }
        },
        resolve: async (src: TSource, args: any, context: ResolverContext, info: GraphQLResolveInfo) => {
            const cmd = new LoadProjectsCommand();
            cmd.onName = args.filterBy?.name;
            cmd.onComponents = args.filterBy?.components;
            cmd.onUsers = args.filterBy?.users;
            cmd.onOwners = args.filterBy?.owner;
            cmd.onIssues = args.filterBy?.issues;
            cmd.onDescription = args.filterBy?.description;
            cmd.afterId = args.after;
            cmd.beforeId = args.before;
            if (args.first) {
                cmd.first = true;
                cmd.limit = args.first;
            } else if (args.last) {
                cmd.first = false;
                cmd.limit = args.first;
            }
            if (propertyProvider) {
                const property = propertyProvider(src);
                const result = await property.getFilteredElements(cmd);
                //TODO: Calculate totalCound and hasNext/hasPrev for usage in page
                return new Page(false, false, result, result.length);
            } else {
                context.dbManager.addCommand(cmd);
                await context.dbManager.executePendingCommands();
                const result = cmd.getResult();
                //TODO: Calculate totalCound and hasNext/hasPrev for usage in page
                return new Page(false, false, result, result.length);
            }
        }
    };
};*/