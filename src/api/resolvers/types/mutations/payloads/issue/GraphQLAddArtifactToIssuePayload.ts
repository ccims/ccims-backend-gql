import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLArtifact from "../../../nodes/GraphQLArtifact";
import GraphQLIssue from "../../../nodes/GraphQLIssue";
import GraphQLIssueTimelineItemEdge from "../../../edges/GraphQLIssueTimelineItemEdge";
import GraphQLAddedArtifactEvent from "../../../nodes/timelineItems/GraphQLAddedArtifactEvent";

const addArtifactToIssuePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "AddArtifactToIssuePayload",
    description: "The Payload/Response for the addToIssueArtifact mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        artifact: {
            type: GraphQLArtifact,
            description: "The Artifact that was added to the issue"
        },
        issue: {
            type: GraphQLIssue,
            description: "The issue to which the specified Artifact was added"
        },
        event: {
            type: GraphQLAddedArtifactEvent,
            description: "The issue timeline event for adding the Artifact to the Issue"
        },
        timelineEdge: {
            type: GraphQLIssueTimelineItemEdge,
            description: "The edge to be able to request other timeline items from this timeline item"
        }
    })
};
const GraphQLAddArtifactToIssuePayload = new GraphQLObjectType(addArtifactToIssuePayloadConfig);
export default GraphQLAddArtifactToIssuePayload;