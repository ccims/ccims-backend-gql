import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLObjectTypeConfig } from "graphql";
import { DeletedIssueComment } from "../../../../../common/nodes/timelineItems/DeletedIssueComment";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLIssue from "../GraphQLIssue";
import GraphQLUser from "../GraphQLUser";
import GraphQLDate from "../../../scalars/GraphQLDate";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem from "../GraphQLIssueTimelineItem";

let deletedIssueCommentConfig: GraphQLObjectTypeConfig<DeletedIssueComment, ResolverContext> = {
    name: "DeletedIssueComment",
    description: "An DeletedIssueComment in the timeline of an issue wiht a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLID),
            description: "The unique id of this timeline item"
        },
        issue: {
            type: GraphQLNonNull(GraphQLIssue),
            description: "The issue this timeline event belongs to"
        },
        createdBy: {
            type: GraphQLUser,
            description: "The user responsible who originally wrote the comment"
        },
        createdAt: {
            type: GraphQLNonNull(GraphQLDate),
            description: "The date the original comment was first written. It's importand to user __this__ date for sorting to maintain the conversation order"
        },
        deletedBy: {
            type: GraphQLUser,
            description: "The user who __deleted__ the comment"
        },
        deletedAt: {
            type: GraphQLDate,
            description: "The date the comment was deleted"
        }
    })
};
let GraphQLDeletedIssueComment = new GraphQLObjectType(deletedIssueCommentConfig);
export default GraphQLDeletedIssueComment;