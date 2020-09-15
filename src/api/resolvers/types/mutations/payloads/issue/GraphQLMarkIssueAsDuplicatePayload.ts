import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLLabel from "../../../nodes/GraphQLLabel";
import GraphQLIssue from "../../../nodes/GraphQLIssue";
import GraphQLIssueTimelineItemEdge from "../../../edges/GraphQLIssueTimelineItemEdge";
import GraphQLMarkedAsDuplicateEvent from "../../../nodes/timelineItems/GraphQLMarkedAsDuplicateEvent";

let markIssueAsDuplicatePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "MarkIssueAsDuplicatePayload",
    description: "The Payload/Response for the markIssueAsDuplicate mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        originalIssue: {
            type: GraphQLIssue,
            description: "The original issue of which the `issue` was marked as a duplicate of"
        },
        issue: {
            type: GraphQLIssue,
            description: "The issue which is a duplicate of the `originalIssue`"
        },
        event: {
            type: GraphQLMarkedAsDuplicateEvent,
            description: "The issue timeline event for marking the issue as a duplicate"
        },
        timelineEdge: {
            type: GraphQLIssueTimelineItemEdge,
            description: "The edge to be able to request other timeline items from this timeline item"
        }
    })
};
let GraphQLMarkIssueAsDuplicatePayload = new GraphQLObjectType(markIssueAsDuplicatePayloadConfig);
export default GraphQLMarkIssueAsDuplicatePayload;