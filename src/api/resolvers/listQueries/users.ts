import { GraphQLFieldConfig, GraphQLResolveInfo } from "graphql";
import { LoadUsersCommand } from "../../../common/database/commands/load/nodes/LoadUsersCommand";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { NodeListProperty } from "../../../common/nodes/properties/NodeListProperty";
import { User } from "../../../common/nodes/User";
import { ResolverContext } from "../../ResolverContext";
import GraphQLUserFilter from "../types/filters/GraphQLUserFilter";
import GraphQLUserPage from "../types/pages/GraphQLUserPage";
import nodeListQuery from "./nodeListQuery";

export default <TSource extends CCIMSNode>(description: string, propertyProvider?: (node: TSource) => NodeListProperty<User, TSource>):
    GraphQLFieldConfig<TSource, ResolverContext> => {
    const baseQuery = nodeListQuery<TSource, User>(GraphQLUserPage, GraphQLUserFilter, description, "users", propertyProvider);
    return {
        ...baseQuery,
        resolve: async (src: TSource, args: any, context: ResolverContext, info: GraphQLResolveInfo) => {
            const cmd = new LoadUsersCommand();
            baseQuery.addParams(cmd, args);
            cmd.username = args.filterBy?.username;
            cmd.displayName = args.filterBy?.displayName;
            cmd.email = args.filterBy?.email;
            cmd.onProjects = args.filterBy?.projects;
            cmd.assignedToIssues = args.filterBy?.assignedToIssues;
            cmd.participantOfIssue = args.filterBy?.participantOfIssues;
            cmd.editedComments = args.filterBy?.comments;
            return baseQuery.createResult(src, context, cmd);
        }
    };
};