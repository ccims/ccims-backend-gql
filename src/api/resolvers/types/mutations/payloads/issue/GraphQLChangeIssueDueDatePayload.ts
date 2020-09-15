import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLIssue from "../../../nodes/GraphQLIssue";
import GraphQLIssueTimelineItemEdge from "../../../edges/GraphQLIssueTimelineItemEdge";
import GraphQLDueDateChangedEvent from "../../../nodes/timelineItems/GraphQLDueDateChangedEvent";

let changeIssueDueDatePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "ChangeIssueDueDatePayload",
    description: "The Payload/Response for the changeIssueDueDate mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        issue: {
            type: GraphQLIssue,
            description: "The issue of which the due date was changed"
        },
        event: {
            type: GraphQLDueDateChangedEvent,
            description: "The issue timeline event for the changed due date"
        },
        timelineEdge: {
            type: GraphQLIssueTimelineItemEdge,
            description: "The edge to be able to request other timeline items from this timeline item"
        }
    })
};
let GraphQLChangeIssueDueDatePayload = new GraphQLObjectType(changeIssueDueDatePayloadConfig);
export default GraphQLChangeIssueDueDatePayload;