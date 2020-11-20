import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLIssue from "../../../nodes/GraphQLIssue";
import GraphQLClosedEvent from "../../../nodes/timelineItems/GraphQLClosedEvent";
import GraphQLIssueTimelineItemEdge from "../../../edges/GraphQLIssueTimelineItemEdge";

const closeIssuePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "CloseIssuePayload",
    description: "The Payload/Response for the closeIssue mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        issue: {
            type: GraphQLIssue,
            description: "The issue which was closed"
        },
        event: {
            type: GraphQLClosedEvent,
            description: "The issue timeline event for the closing of the issue"
        },
        timelineEdge: {
            type: GraphQLIssueTimelineItemEdge,
            description: "The edge to be able to request other timeline items from this timeline item"
        }
    })
};
const GraphQLCloseIssuePayload = new GraphQLObjectType(closeIssuePayloadConfig);
export default GraphQLCloseIssuePayload;