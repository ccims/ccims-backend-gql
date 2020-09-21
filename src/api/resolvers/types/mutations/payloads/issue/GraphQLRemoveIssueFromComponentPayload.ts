import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLComponent from "../../../nodes/GraphQLComponent";
import GraphQLIssue from "../../../nodes/GraphQLIssue";
import GraphQLIssueTimelineItemEdge from "../../../edges/GraphQLIssueTimelineItemEdge";
import GraphQLRemovedFromComponentEvent from "../../../nodes/timelineItems/GraphQLRemovedFromComponentEvent";

const removeIssueFromComponentPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "RemoveIssueFromComponentPayload",
    description: "The Payload/Response for the removeIssueFromComponent mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        component: {
            type: GraphQLComponent,
            description: "The component the issue was removed from (including from the components IMS)"
        },
        issue: {
            type: GraphQLIssue,
            description: "The issue which removed from the component"
        },
        event: {
            type: GraphQLRemovedFromComponentEvent,
            description: "The issue timeline event for the removal of the issue from the component"
        },
        timelineEdge: {
            type: GraphQLIssueTimelineItemEdge,
            description: "The edge to be able to request other timeline items from this timeline item"
        }
    })
};
const GraphQLRemoveIssueFromComponentPayload = new GraphQLObjectType(removeIssueFromComponentPayloadConfig);
export default GraphQLRemoveIssueFromComponentPayload;