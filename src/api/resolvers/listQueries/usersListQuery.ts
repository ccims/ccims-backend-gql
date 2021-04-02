import { GraphQLFieldConfig, GraphQLResolveInfo } from "graphql";
import { LoadUsersCommand } from "../../../common/database/commands/load/nodes/LoadUsersCommandBase";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { ListProperty } from "../../../common/nodes/properties/ListProperty";
import { NodeListProperty } from "../../../common/nodes/properties/NodeListProperty";
import { User } from "../../../common/nodes/User";
import { ResolverContext } from "../../ResolverContext";
import GraphQLUserFilter from "../types/filters/GraphQLUserFilter";
import GraphQLUserPage from "../types/pages/GraphQLUserPage";
import nodeListQuery from "./nodeListQuery";

/**
 * Creates a users query GraphQLFieldConfig including a resolver using the property provided by the property provider or the database manager in the context
 *
 * @param description The description text for the users query
 * @param propertyProvider A provider function providing a property of the destination/node type from which to request the nodes when given a node of the source type
 * @returns A GraphQLFieldConfig with fields needed for a resolvable users query
 */
function usersListQuery<TSource extends CCIMSNode, TProperty extends Partial<User>>(
    description: string,
    propertyProvider?: (node: TSource) => ListProperty<TProperty & CCIMSNode>
): GraphQLFieldConfig<TSource, ResolverContext> {
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
export default usersListQuery;