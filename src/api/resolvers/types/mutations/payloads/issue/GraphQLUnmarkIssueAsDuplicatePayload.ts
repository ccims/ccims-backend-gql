import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLIssueTimelineItemEdge from "../../../edges/GraphQLIssueTimelineItemEdge";
import GraphQLIssue from "../../../nodes/GraphQLIssue";
import GraphQLUnmarkedAsDuplicateEvent from "../../../nodes/timelineItems/GraphQLUnmarkedAsDuplicateEvent";

const unmarkIssueAsDuplicatePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "UnmarkIssueAsDuplicatePayload",
    description: "The Payload/Response for the unmarkIssueAsDuplicate mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        issue: {
            type: GraphQLIssue,
            description: "The issue which was unmarked as duplicate"
        },
        event: {
            type: GraphQLUnmarkedAsDuplicateEvent,
            description: "The issue timeline event for the removal of the duplicate marking of the issue"
        },
        timelineEdge: {
            type: GraphQLIssueTimelineItemEdge,
            description: "The edge to be able to request other timeline items from this timeline item"
        }
    })
};
const GraphQLUnmarkIssueAsDuplicatePayload = new GraphQLObjectType(unmarkIssueAsDuplicatePayloadConfig);
export default GraphQLUnmarkIssueAsDuplicatePayload;