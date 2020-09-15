import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLComponent from "../../../nodes/GraphQLComponent";
import GraphQLIssue from "../../../nodes/GraphQLIssue";
import GraphQLIssueTimelineItemEdge from "../../../edges/GraphQLIssueTimelineItemEdge";
import GraphQLPinnedEvent from "../../../nodes/timelineItems/GraphQLPinnedEvent";

let pinIssuePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "PinIssuePayload",
    description: "The Payload/Response for the pinIssue mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        component: {
            type: GraphQLComponent,
            description: "The component the issue was pinned to"
        },
        issue: {
            type: GraphQLIssue,
            description: "The issue which removed from the location"
        },
        event: {
            type: GraphQLPinnedEvent,
            description: "The issue timeline event for the pinnine of the issue to the component"
        },
        timelineEdge: {
            type: GraphQLIssueTimelineItemEdge,
            description: "The edge to be able to request other timeline items from this timeline item"
        }
    })
};
let GraphQLPinIssuePayload = new GraphQLObjectType(pinIssuePayloadConfig);
export default GraphQLPinIssuePayload;