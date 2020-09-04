import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLBoolean, GraphQLList } from "graphql";
import GraphQLNode from "../GraphQLNode";
import GraphQLDate from "../../scalars/GraphQLDate";
import GraphQLTimeSpan from "../../scalars/GraphQLTimeSpan";
import GraphQLUser from "./GraphQLUser";
import GraphQLIssueCategory from "../../enums/GraphQLIssueCategory";
import linkedIssues from "../../listQueries/issue/linkedIssues";
import assignees from "../../listQueries/issue/assignees";
import issueComments from "../../listQueries/issue/issueComments";
import reactions from "../../listQueries/issue/reactions";
import labels from "../../listQueries/issue/labels";
import participants from "../../listQueries/issue/participants";
import pinnedOn from "../../listQueries/issue/pinnedOn";
import timeline from "../../listQueries/issue/timeline";
import locations from "../../listQueries/issue/locations";
import GraphQLComment from "./GraphQLComment";

export default new GraphQLObjectType({
    name: "Issue",
    description: "A cros component issue within ccims which links multiple issues from single ims",
    interfaces: [GraphQLComment, GraphQLNode],
    fields: {
        id: {
            type: GraphQLNonNull(GraphQLID),
            description: "The unique id of this issue"
        },
        title: {
            type: GraphQLNonNull(GraphQLString),
            description: "The title to display for this issue.\n\nNot unique; Max. 256 characters"
        },
        body: {
            type: GraphQLString,
            description: "The body text of the issue.\nMarkdown supported.\n\nMax. 65536 characters"
        },
        bodyRendered: {
            type: GraphQLString,
            description: "The body text of the issue rendered to html"
        },
        createdBy: {
            type: GraphQLUser,
            description: "The user who originally created the issue (in ccims or any ims)"
        },
        editedBy: {
            type: GraphQLList(GraphQLNonNull(GraphQLUser)),
            description: "A list of all people who edited the root of this issue (body and title)"
        },
        createdAt: {
            type: GraphQLNonNull(GraphQLDate),
            description: "The date the issue was first created on"
        },
        lastEditedAt: {
            type: GraphQLDate,
            description: "Date when the core issue(title, body etc.) was last changed (comments and other events DO NOT count)"
        },
        updatedAt: {
            type: GraphQLDate,
            description: "Date when any update / activity was made to any part of the issue (__including__ title, commens, reactions)"
        },
        isOpen: {
            type: GraphQLNonNull(GraphQLBoolean),
            description: "`true` iff the issue is open at this point"
        },
        isDuplicate: {
            type: GraphQLNonNull(GraphQLBoolean),
            description: "Weather or not this issue has been marked as duplicate of another issue"
        },
        category: {
            type: GraphQLNonNull(GraphQLIssueCategory),
            description: "The ccims-issue-category the issue belongs to.\n\nThis can be one of BUG,FEATURE_REQUEST or UNCLASSIFIED"
        },
        currentUserCanEdit: {
            type: GraphQLNonNull(GraphQLBoolean),
            description: "`true` iff the user authenticated by the given JWT is permitted to edit this issue.\n\nThis only refers to editing the core issue (title, body, etc.)"
        },
        currentUserCanComment: {
            type: GraphQLNonNull(GraphQLBoolean),
            description: "`true` iff the user authenticated by the given JWT is permitted to comment on this issue."
        },
        startDate: {
            type: GraphQLDate,
            description: "A start date set for start of work on this issue.\n\nThis is only for displaying and has no effect on the ccims but will be synce to other ims"
        },
        dueDate: {
            type: GraphQLDate,
            description: "A due date set when work on the issue must be done.\n\nThis is only for displaying and has no effect on the ccims but will be synce to other ims"
        },
        estimatedTime: {
            type: GraphQLTimeSpan,
            description: "The time estimated needed for work on this issue.\n\nThis is only for displaying and has no effect on the ccims but will be synce to other ims"
        },
        spentTime: {
            type: GraphQLTimeSpan,
            description: "The time already spent on work on this issue.\n\nThis is only for displaying and has no effect on the ccims but will be synce to other ims"
        },
        issueComments,
        linkedIssues,
        reactions,
        assignees,
        labels,
        participants,
        pinnedOn,
        timeline,
        locations,
    }
});