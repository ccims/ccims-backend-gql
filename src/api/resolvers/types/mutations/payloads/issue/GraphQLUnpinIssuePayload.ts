import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLIssue from "../../../nodes/GraphQLIssue";
import GraphQLComment from "../../../nodes/GraphQLComment";
import GraphQLUnpinnedEvent from "../../../nodes/timelineItems/GraphQLUnpinnedEvent";
import GraphQLIssueTimelineItemEdge from "../../../edges/GraphQLIssueTimelineItemEdge";

let unpinIssuePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "UnpinIssuePayload",
    description: "The Payload/Response for the unpinIssue mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        issue: {
            type: GraphQLIssue,
            description: "The issue which was unpinned by the performed mutation"
        },
        component: {
            type: GraphQLComment,
            description: "The component the issue was unpinned from"
        },
        event: {
            type: GraphQLUnpinnedEvent,
            description: "The issue timeline event for the unpinning of the issue"
        },
        timelineEdge: {
            type: GraphQLIssueTimelineItemEdge,
            description: "The edge to be able to request other timeline items from this timeline item"
        }
    })
};
let GraphQLUnpinIssuePayload = new GraphQLObjectType(unpinIssuePayloadConfig);
export default GraphQLUnpinIssuePayload;