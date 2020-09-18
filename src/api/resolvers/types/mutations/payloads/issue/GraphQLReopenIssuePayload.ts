import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLIssue from "../../../nodes/GraphQLIssue";
import GraphQLReopenedEvent from "../../../nodes/timelineItems/GraphQLReopenedEvent";
import GraphQLIssueTimelineItemEdge from "../../../edges/GraphQLIssueTimelineItemEdge";

const reopenIssuePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "ReopenIssuePayload",
    description: "The Payload/Response for the reopenIssue mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        issue: {
            type: GraphQLIssue,
            description: "The issue which was reopened"
        },
        event: {
            type: GraphQLReopenedEvent,
            description: "The issue timeline event for the reopening of the issue"
        },
        timelineEdge: {
            type: GraphQLIssueTimelineItemEdge,
            description: "The edge to be able to request other timeline items from this timeline item"
        }
    })
};
const GraphQLReopenIssuePayload = new GraphQLObjectType(reopenIssuePayloadConfig);
export default GraphQLReopenIssuePayload;