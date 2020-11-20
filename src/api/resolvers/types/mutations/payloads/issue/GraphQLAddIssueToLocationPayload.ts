import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLIssueLocation from "../../../nodes/GraphQLIssueLocation";
import GraphQLIssue from "../../../nodes/GraphQLIssue";
import GraphQLIssueTimelineItemEdge from "../../../edges/GraphQLIssueTimelineItemEdge";
import GraphQLAddedToLocationEvent from "../../../nodes/timelineItems/GraphQLAddedToLocationEvent";

const addIssueToLocationPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "AddIssueToLocationPayload",
    description: "The Payload/Response for the addIssueToLocation mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        location: {
            type: GraphQLIssueLocation,
            description: "The location the issue was added to"
        },
        issue: {
            type: GraphQLIssue,
            description: "The issue which removed from the location"
        },
        event: {
            type: GraphQLAddedToLocationEvent,
            description: "The issue timeline event for the addition of the issue to the location"
        },
        timelineEdge: {
            type: GraphQLIssueTimelineItemEdge,
            description: "The edge to be able to request other timeline items from this timeline item"
        }
    })
};
const GraphQLAddIssueToLocationPayload = new GraphQLObjectType(addIssueToLocationPayloadConfig);
export default GraphQLAddIssueToLocationPayload;