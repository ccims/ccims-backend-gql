import { GraphQLFieldConfig, GraphQLString, GraphQLInt, GraphQLResolveInfo } from "graphql";
import GraphQLUserPage from "../types/pages/GraphQLUserPage";
import GraphQLUserFilter from "../types/filters/GraphQLUserFilter";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { NodeListProperty } from "../../../common/nodes/properties/NodeListProperty";
import { User } from "../../../common/nodes/User";
import { ResolverContext } from "../../ResolverContext";
import namedOwnedNodeListQuery from "./namedOwnedNodeListQuery";
import { LoadUsersCommand } from "../../../common/database/commands/load/nodes/LoadUsersCommand";
import nodeListQuery from "./nodeListQuery";
import { Page } from "../utils/Page";

export default <TSource extends CCIMSNode>(description: string, propertyProvider?: (node: TSource) => NodeListProperty<User, TSource>):
    GraphQLFieldConfig<TSource, ResolverContext> => {
    const baseQuery = nodeListQuery(GraphQLUserPage, GraphQLUserFilter, description, "users");
    return {
        ...baseQuery,
        resolve: async (src: TSource, args: any, context: ResolverContext, info: GraphQLResolveInfo) => {
            const cmd = new LoadUsersCommand();
            cmd.onUsername = args.filterBy?.username;
            cmd.onDisplayName = args.filterBy?.displayName;
            cmd.onEmail = args.filterBy?.email;
            cmd.onProjects = args.filterBy?.projects;
            cmd.onAssignedToIssues = args.filterBy?.assignedToIssues;
            cmd.onParticipantOfIssue = args.filterBy?.participantOfIssues;
            cmd.onComments = args.filterBy?.comments;
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