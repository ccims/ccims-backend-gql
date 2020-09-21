import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLString } from "graphql";
import { Issue } from "../../../../common/nodes/Issue";
import { Project } from "../../../../common/nodes/Project";
import { IssueComment } from "../../../../common/nodes/timelineItems/IssueComment";
import { User } from "../../../../common/nodes/User";
import { ResolverContext } from "../../../ResolverContext";
import issueCommentsListQuery from "../../listQueries/issueCommentsListQuery";
import issuesListQuery from "../../listQueries/issuesListQuery";
import projectsListQuery from "../../listQueries/projectsListQuery";
import GraphQLNode from "../GraphQLNode";

const userConfig: GraphQLObjectTypeConfig<User, ResolverContext> = {
    name: "User",
    description: "A user of th ccims. Can be assigned to projects, components and can have multiple ims accounts",
    interfaces: () => ([GraphQLNode]),
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLID),
            description: "The unique id of this user"
        },
        username: {
            type: GraphQLNonNull(GraphQLString),
            description: "The unique username used for login"
        },
        displayName: {
            type: GraphQLString,
            description: "The name of the user to display in the GUI"
        },
        email: {
            type: GraphQLString,
            description: "The mail address of the user"
        },
        projects: projectsListQuery<User, Project>("All the projects this user is a participant of matching `filterBy`", user => user.projectsProperty),
        assignedToIssues: issuesListQuery<User, Issue>("All issues that this the user is assigned to matching (if given) `filterBy`", user => user.assignedToIssuesProperty),
        participantOfIssues: issuesListQuery<User, Issue>("All issues that this the user is a participant of matching (if given) `filterBy`", user => user.participantOfIssuesProperty),
        issueComments: issueCommentsListQuery<User, IssueComment>("All issue comments (not including issues) written by this user", user => user.commentsProperty)
    })
};
const GraphQLUser = new GraphQLObjectType(userConfig);
export default GraphQLUser;