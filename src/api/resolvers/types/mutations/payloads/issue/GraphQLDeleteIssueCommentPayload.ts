import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLDeletedIssueComment from "../../../nodes/timelineItems/GraphQLDeletedIssueComment";
import GraphQLIssue from "../../../nodes/GraphQLIssue";
import GraphQLIssueTimelineItemEdge from "../../../edges/GraphQLIssueTimelineItemEdge";

const deleteIssueCommentPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "DeleteIssueCommentPayload",
    description: "The Payload/Response for the deleteIssueComment mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        deletedComment: {
            type: GraphQLDeletedIssueComment,
            description: "A replacement for the deleted comment to be shown in the GUI instead of the original comment for the completeness of the history"
        },
        issue: {
            type: GraphQLIssue,
            description: "The issue from which the comment was removed"
        },
        event: {
            type: GraphQLDeletedIssueComment,
            description: "The issue timeline event for the deletion of the comment"
        },
        timelineEdge: {
            type: GraphQLIssueTimelineItemEdge,
            description: "The edge to be able to request other timeline items from this timeline item"
        }
    })
};
const GraphQLDeleteIssueCommentPayload = new GraphQLObjectType(deleteIssueCommentPayloadConfig);
export default GraphQLDeleteIssueCommentPayload;