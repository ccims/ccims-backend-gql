import { GraphQLFieldConfig, GraphQLString, GraphQLInt, GraphQLResolveInfo } from "graphql";
import GraphQLProjectPage from "../types/pages/GraphQLProjectPage";
import GraphQLProjectFilter from "../types/filters/GraphQLProjectFilter";
import { ResolverContext } from "../../ResolverContext";
import { User } from "../../../common/nodes/User";
import { LoadProjectsCommand } from "../../../common/database/commands/load/nodes/LoadProjectsCommand";
import { NodeListProperty } from "../../../common/nodes/properties/NodeListProperty";
import { Project } from "../../../common/nodes/Project";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { Page } from "../utils/Page";
import namedNodeListQuery from "./namedNodeListQuery";
import namedOwnedNodeListQuery from "./namedOwnedNodeListQuery";

export default <TSource extends CCIMSNode>(description: string, propertyProvider?: (node: TSource) => NodeListProperty<Project, TSource>):
    GraphQLFieldConfig<TSource, ResolverContext> => {
    const baseQuery = namedOwnedNodeListQuery(GraphQLProjectPage, GraphQLProjectFilter, description, "projects");
    return {
        ...baseQuery,
        resolve: async (src: TSource, args: any, context: ResolverContext, info: GraphQLResolveInfo) => {
            const cmd = new LoadProjectsCommand();
            cmd.onComponents = args.filterBy?.components;
            cmd.onUsers = args.filterBy?.users;
            cmd.onIssues = args.filterBy?.issues;
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
};

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