import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLLabel from "../../../nodes/GraphQLLabel";
import GraphQLIssue from "../../../nodes/GraphQLIssue";
import GraphQLIssueTimelineItemEdge from "../../../edges/GraphQLIssueTimelineItemEdge";
import GraphQLLabelledEvent from "../../../nodes/timelineItems/GraphQLLabelledEvent";

let addLabelToIssuePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "AddLabelToIssuePayload",
    description: "The Payload/Response for the addToIssueLabel mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        label: {
            type: GraphQLLabel,
            description: "The label that was added to the issue"
        },
        issue: {
            type: GraphQLIssue,
            description: "The issue to which the specified label was added"
        },
        event: {
            type: GraphQLLabelledEvent,
            description: "The issue timeline event for the labeling of the issue with the specified label"
        },
        timelineEdge: {
            type: GraphQLIssueTimelineItemEdge,
            description: "The edge to be able to request other timeline items from this timeline item"
        }
    })
};
let GraphQLAddLabelToIssuePayload = new GraphQLObjectType(addLabelToIssuePayloadConfig);
export default GraphQLAddLabelToIssuePayload;