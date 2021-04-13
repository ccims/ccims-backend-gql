import { GraphQLFieldConfig, GraphQLInputObjectType, GraphQLObjectType, GraphQLResolveInfo } from "graphql";
import { LoadNodeListCommand } from "../../../common/database/commands/load/nodes/LoadNodeListCommand";
import { LoadUsersCommand } from "../../../common/database/commands/load/nodes/LoadUsersCommand";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";
import { ListProperty } from "../../../common/nodes/properties/ListProperty";
import { User } from "../../../common/nodes/User";
import { ResolverContext } from "../../ResolverContext";
import GraphQLUserFilter from "../types/filters/GraphQLUserFilter";
import GraphQLUserPage from "../types/pages/GraphQLUserPage";
import { listQueryType } from "./listQuery";
import nodeListQuery from "./nodeListQuery";

/**
 * necessary filter fields for syncNodeListQuery
 */
 export interface UserCommandFilterFields {
    username: string | undefined,
    displayName: string | undefined,
    email: string | undefined,
    assignedToIssues: string[] | undefined,
    participantOfIssues: string[] | undefined,
    editedComments: string[] | undefined
}

/**
 * Creates the base for a node list query for a GraphQL property.
 *
 * This contains the basic argument and type structure and logic for inserting the limiting parameters
 * into the command and generating the resulting page from given command and arguments
 *
 * @param pageType The GraphQL Type of the Page which is returned for the query
 * @param filterType The type of the GraphQL filter to be used for the query
 * @param description The description text of the query
 * @param nodeNamePlural The name of the nodes to be requested, lowercase, plural, will be inserted into the arguments descriptions
 * @param propertyProvider A provider function providing a property of the destination/node type from which to request the nodes when given a node of the source type
 * @returns The base for a node list query (a `GraphQLFieldConfig` additional functionality)
 */
export function usersListQueryBase<TSource extends CCIMSNode, TNode extends User>(
    pageType: GraphQLObjectType,
    filterType: GraphQLInputObjectType,
    description: string,
    nodeNamePlural: string,
    propertyProvider?: (node: TSource) => ListProperty<Partial<TNode> & CCIMSNode>
): listQueryType<TSource, TNode, UserCommandFilterFields> {
    const baseQuery = nodeListQuery<TSource, TNode>(pageType, filterType, description, nodeNamePlural, propertyProvider);
    return {
        ...baseQuery,
        addParams: (cmd: LoadNodeListCommand<TNode> & UserCommandFilterFields, args: any) => {
            baseQuery.addParams(cmd, args);
            cmd.username = args.filterBy?.username;
            cmd.displayName = args.filterBy?.displayName;
            cmd.email = args.filterBy?.email;
            cmd.assignedToIssues = args.filterBy?.assignedToIssues;
            cmd.participantOfIssues = args.filterBy?.participantOfIssues;
            cmd.editedComments = args.filterBy?.comments;
        }
    };
};

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
    const baseQuery = usersListQueryBase<TSource, User>(GraphQLUserPage, GraphQLUserFilter, description, "Users", propertyProvider);
    return {
        ...baseQuery,
        resolve: async (src: TSource, args: any, context: ResolverContext, info: GraphQLResolveInfo) => {
            const cmd = new LoadUsersCommand();
            cmd.loadLinkedUsers = true;
            baseQuery.addParams(cmd, args);
            
            return baseQuery.createResult(src, context, cmd);
        }
    };
};
export default usersListQuery;