import { GraphQLFieldConfigMap, GraphQLInterfaceType, GraphQLInterfaceTypeConfig, GraphQLNonNull, GraphQLString } from "graphql";
import { Issue } from "../../../../common/nodes/Issue";
import { IssueComment } from "../../../../common/nodes/timelineItems/IssueComment";
import { User } from "../../../../common/nodes/User";
import { ResolverContext } from "../../../ResolverContext";
import issueCommentsListQuery from "../../listQueries/issueCommentsListQuery";
import issuesListQuery from "../../listQueries/issuesListQuery";
import GraphQLNode, { nodeFields } from "../GraphQLNode";

/**
 * Generates the fields for a User
 * @param name the name of the user
 * @param namePlural the plural for of name, defaults to name + "s"
 * @returns the fields config
 */
export function userFields<T extends User>(name: string, namePlural: string = name + "s"): GraphQLFieldConfigMap<T, ResolverContext> {
    return {
        ...nodeFields<T>(name, namePlural),
        username: {
            type: GraphQLNonNull(GraphQLString),
            description: "The unique username used"
        },
        displayName: {
            type: GraphQLNonNull(GraphQLString),
            description: `The name of the ${name} to display in the GUI`
        },
        email: {
            type: GraphQLString,
            description: `The mail address of the ${name}`
        },
        assignedToIssues: issuesListQuery<T, Issue>(`All Issues that this the ${name} is assigned to matching (if given) \`filterBy\``, user => user.assignedToIssuesProperty),
        participantOfIssues: issuesListQuery<T, Issue>(`All Issues that this the ${name} is a participant of matching (if given) \`filterBy\``, user => user.participantOfIssuesProperty),
        issueComments: issueCommentsListQuery<T, IssueComment>(`All IssueComments (not including Issues) written by this ${name}`, user => user.commentsProperty)
    };
}

const userConfig: GraphQLInterfaceTypeConfig<User, ResolverContext> = {
    name: "User",
    description: "A user registered ",
    interfaces: () => ([GraphQLNode]),
    fields: () => userFields<User>("User")
};
const GraphQLUser = new GraphQLInterfaceType(userConfig);
export default GraphQLUser;