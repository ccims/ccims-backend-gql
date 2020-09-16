import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLIssueLocation from "../../../nodes/GraphQLIssueLocation";
import GraphQLIssue from "../../../nodes/GraphQLIssue";
import GraphQLRemovedFromLocationEvent from "../../../nodes/timelineItems/GraphQLRemovedFromLocationEvent";
import GraphQLIssueTimelineItemEdge from "../../../edges/GraphQLIssueTimelineItemEdge";

let removeIssueFromLocationPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "RemoveIssueFromLocationPayload",
    description: "The Payload/Response for the removeIssueFromLocation mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        location: {
            type: GraphQLIssueLocation,
            description: "The issue location the issue was removed from"
        },
        issue: {
            type: GraphQLIssue,
            description: "The issue which removed from the location"
        },
        event: {
            type: GraphQLRemovedFromLocationEvent,
            description: "The issue timeline event for the removal of the issue from the location"
        },
        timelineEdge: {
            type: GraphQLIssueTimelineItemEdge,
            description: "The edge to be able to request other timeline items from this timeline item"
        }
    })
};
let GraphQLRemoveIssueFromLocationPayload = new GraphQLObjectType(removeIssueFromLocationPayloadConfig);
export default GraphQLRemoveIssueFromLocationPayload;