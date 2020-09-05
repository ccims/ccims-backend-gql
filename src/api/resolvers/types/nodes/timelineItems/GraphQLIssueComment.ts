import { GraphQLInterfaceType, GraphQLNonNull, GraphQLBoolean, GraphQLList, GraphQLString, GraphQLID, GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import GraphQLUser from "../GraphQLUser";
import GraphQLDate from "../../../scalars/GraphQLDate";
import reactions from "../../../listQueries/issue/reactions";
import GraphQLIssue from "../GraphQLIssue";
import GraphQLIssueTimelineItem from "../GraphQLIssueTimelineItem";
import GraphQLComment from "../GraphQLComment";
import GraphQLNode from "../../GraphQLNode";
import { IssueComment } from "../../../../../common/nodes/timelineItems/IssueComment";
import { ResolverContext } from "../../../../ResolverContext";

let issueCommentConfig: GraphQLObjectTypeConfig<IssueComment, ResolverContext> = {
    name: "IssueComment",
    description: "A commemt on an issue. Not including th issue body itself",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLComment, GraphQLNode]),
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLID),
            description: "The unique id of this comment"
        },
        issue: {
            type: GraphQLNonNull(GraphQLIssue),
            description: "The issue this comment belongs to"
        },
        body: {
            type: GraphQLString,
            description: "The body text of the comment.\nMarkdown supported.\n\nMax. 65536 characters"
        },
        bodyRendered: {
            type: GraphQLString,
            description: "The body text of the comment rendered to html"
        },
        createdBy: {
            type: GraphQLUser,
            description: "The user who originally created the comment (in ccims or any ims)"
        },
        editedBy: {
            type: GraphQLList(GraphQLNonNull(GraphQLUser)),
            description: "A list of all people who edited the root of this comment (body and title)"
        },
        createdAt: {
            type: GraphQLNonNull(GraphQLDate),
            description: "The date the comment was first created on"
        },
        lastEditedAt: {
            type: GraphQLDate,
            description: "Date when the core comment(title, body etc.) was last changed (comments and other events DO NOT count)"
        },
        currentUserCanEdit: {
            type: GraphQLNonNull(GraphQLBoolean),
            description: "`true` iff the user authenticated by the given JWT is permitted to edit this comment.\n\nThis only refers to editing the core comment (title, body, etc.)"
        },
        reactions: reactions(),
    })
};
let GraphQLIssueComment = new GraphQLObjectType(issueCommentConfig);
export default GraphQLIssueComment;