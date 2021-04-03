import { GraphQLFieldConfig, GraphQLResolveInfo } from "graphql";
import { LoadIMSUsersCommand } from "../../../common/database/commands/load/nodes/LoadIMSUsersCommand";
import { LoadUsersCommand } from "../../../common/database/commands/load/nodes/LoadUsersCommand";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { IMSUser } from "../../../common/nodes/IMSUser";
import { ListProperty } from "../../../common/nodes/properties/ListProperty";
import { User } from "../../../common/nodes/User";
import { ResolverContext } from "../../ResolverContext";
import GraphQLUserFilter from "../types/filters/GraphQLUserFilter";
import GraphQLUserPage from "../types/pages/GraphQLUserPage";
import nodeListQuery from "./nodeListQuery";

/**
 * Creates a IMSUser query GraphQLFieldConfig including a resolver using the property provided by the property provider or the database manager in the context
 *
 * @param description The description text for the IMSUser query
 * @param propertyProvider A provider function providing a property of the destination/node type from which to request the nodes when given a node of the source type
 * @returns A GraphQLFieldConfig with fields needed for a resolvable users query
 */
function imsUsersListQuery<TSource extends CCIMSNode, TProperty extends Partial<IMSUser>>(
    description: string,
    propertyProvider?: (node: TSource) => ListProperty<TProperty & CCIMSNode>
): GraphQLFieldConfig<TSource, ResolverContext> {
    const baseQuery = nodeListQuery<TSource, User>(GraphQLUserPage, GraphQLUserFilter, description, "users", propertyProvider);
    return {
        ...baseQuery,
        resolve: async (src: TSource, args: any, context: ResolverContext, info: GraphQLResolveInfo) => {
            const cmd = new LoadIMSUsersCommand();
            baseQuery.addParams(cmd, args);
            cmd.username = args.filterBy?.username;
            cmd.displayName = args.filterBy?.displayName;
            cmd.email = args.filterBy?.email;
            cmd.assignedToIssues = args.filterBy?.assignedToIssues;
            cmd.participantOfIssue = args.filterBy?.participantOfIssues;
            cmd.editedComments = args.filterBy?.comments;
            return baseQuery.createResult(src, context, cmd);
        }
    };
};
export default imsUsersListQuery;