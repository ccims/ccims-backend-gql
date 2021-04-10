import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLString } from "graphql";
import { CCIMSUser } from "../../../../common/nodes/CCIMSUser";
import { Issue } from "../../../../common/nodes/Issue";
import { IssueComment } from "../../../../common/nodes/timelineItems/IssueComment";
import { ResolverContext } from "../../../ResolverContext";
import imsUsersListQuery from "../../listQueries/imsUsersListQuery";
import issueCommentsListQuery from "../../listQueries/issueCommentsListQuery";
import issuesListQuery from "../../listQueries/issuesListQuery";
import GraphQLNode from "../GraphQLNode";
import GraphQLUser from "./GraphQLUser";
import { IMSUser } from "../../../../common/nodes/IMSUser";

const ccimsUserConfig: GraphQLObjectTypeConfig<CCIMSUser, ResolverContext> = {
    name: "CCIMSUser",
    description: "A user of the ccims. Can be assigned to projects, components and can have multiple ims accounts",
    interfaces: () => ([GraphQLNode, GraphQLUser]),
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
        assignedToIssues: issuesListQuery<CCIMSUser, Issue>("All issues that this the user is assigned to matching (if given) `filterBy`", user => user.assignedToIssuesProperty),
        participantOfIssues: issuesListQuery<CCIMSUser, Issue>("All issues that this the user is a participant of matching (if given) `filterBy`", user => user.participantOfIssuesProperty),
        issueComments: issueCommentsListQuery<CCIMSUser, IssueComment>("All issue comments (not including issues) written by this user", user => user.commentsProperty),
        imsUsers: imsUsersListQuery<CCIMSUser, IMSUser>("All IMSUsers of this CCIMSUser which match `filterBy`", user => user.linkedByUsersProperty)
    })
};
const GraphQLCCIMSUser = new GraphQLObjectType(ccimsUserConfig);
export default GraphQLCCIMSUser;