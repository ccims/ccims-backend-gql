import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLIssue from "../../../nodes/GraphQLIssue";
import GraphQLIssueTimelineItemEdge from "../../../edges/GraphQLIssueTimelineItemEdge";
import GraphQLArtifact from "../../../nodes/GraphQLArtifact";
import GraphQLRemovedArtifactEvent from "../../../nodes/timelineItems/GraphQLRemovedArtifactEvent";

const removeArtifactFromIssuePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "RemoveArtifactFromIssuePayload",
    description: "The Payload/Response for the removeFromIssueArtifact mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        artifact: {
            type: GraphQLArtifact,
            description: "The Artifact that was removed from the issue"
        },
        issue: {
            type: GraphQLIssue,
            description: "The issue from which the Artifact was removed"
        },
        event: {
            type: GraphQLRemovedArtifactEvent,
            description: "The issue timeline event for the removal of the Artifact from the issue"
        },
        timelineEdge: {
            type: GraphQLIssueTimelineItemEdge,
            description: "The edge to be able to request other timeline items from this timeline item"
        }
    })
};
const GraphQLRemoveArtifactFromIssuePayload = new GraphQLObjectType(removeArtifactFromIssuePayloadConfig);
export default GraphQLRemoveArtifactFromIssuePayload;