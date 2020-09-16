import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLIssue from "../../../nodes/GraphQLIssue";
import GraphQLEstimatedTimeChangedEvent from "../../../nodes/timelineItems/GraphQLEstimatedTimeChangedEvent";
import GraphQLIssueTimelineItemEdge from "../../../edges/GraphQLIssueTimelineItemEdge";

let changeIssueEstimatedTimePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "ChangeIssueEstimatedTimePayload",
    description: "The Payload/Response for the changeIssueEstimatedTime mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        issue: {
            type: GraphQLIssue,
            description: "The issue of which the estimated time was changed"
        },
        event: {
            type: GraphQLEstimatedTimeChangedEvent,
            description: "The issue timeline event for the changed estimated time"
        },
        timelineEdge: {
            type: GraphQLIssueTimelineItemEdge,
            description: "The edge to be able to request other timeline items from this timeline item"
        }
    })
};
let GraphQLChangeIssueEstimatedTimePayload = new GraphQLObjectType(changeIssueEstimatedTimePayloadConfig);
export default GraphQLChangeIssueEstimatedTimePayload;