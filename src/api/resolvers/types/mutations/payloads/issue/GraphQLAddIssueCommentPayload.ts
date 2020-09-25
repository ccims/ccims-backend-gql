import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLIssueComment from "../../../nodes/timelineItems/GraphQLIssueComment";
import GraphQLIssue from "../../../nodes/GraphQLIssue";
import GraphQLIssueTimelineItemEdge from "../../../edges/GraphQLIssueTimelineItemEdge";
import GraphQLIssueCommentFilter from "../../../filters/GraphQLIssueCommentFilter";

const addIssueCommentPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "AddIssueCommentPayload",
    description: "The Payload/Response for the addIssueComment mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        comment: {
            type: GraphQLIssueComment,
            description: "The issue comment object that was created.\n\n__NOTE:__This is also the timeline event!"
        },
        issue: {
            type: GraphQLIssue,
            description: "The issue to which the user was assigned"
        },
        timelineEdge: {
            type: GraphQLIssueTimelineItemEdge,
            description: "The edge to be able to request other timeline items from this timeline item"
        }
    })
};
const GraphQLAddIssueCommentPayload = new GraphQLObjectType(addIssueCommentPayloadConfig);
export default GraphQLAddIssueCommentPayload;