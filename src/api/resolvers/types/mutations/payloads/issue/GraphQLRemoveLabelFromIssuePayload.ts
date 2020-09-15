import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLUnlabelledEvent from "../../../nodes/timelineItems/GraphQLUnlabelledEvent";
import GraphQLIssue from "../../../nodes/GraphQLIssue";
import GraphQLIssueTimelineItemEdge from "../../../edges/GraphQLIssueTimelineItemEdge";
import GraphQLLabel from "../../../nodes/GraphQLLabel";

let removeLabelFromIssuePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "RemoveLabelFromIssuePayload",
    description: "The Payload/Response for the removeFromIssueLabel mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        label: {
            type: GraphQLLabel,
            description: "The label that was removed from the issue"
        },
        issue: {
            type: GraphQLIssue,
            description: "The issue from which the label was removed"
        },
        event: {
            type: GraphQLUnlabelledEvent,
            description: "The issue timeline event for the removal of the label from the issue"
        },
        timelineEdge: {
            type: GraphQLIssueTimelineItemEdge,
            description: "The edge to be able to request other timeline items from this timeline item"
        }
    })
};
let GraphQLRemoveLabelFromIssuePayload = new GraphQLObjectType(removeLabelFromIssuePayloadConfig);
export default GraphQLRemoveLabelFromIssuePayload;