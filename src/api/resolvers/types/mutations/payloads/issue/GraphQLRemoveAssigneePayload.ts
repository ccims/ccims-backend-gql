import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLUser from "../../../nodes/GraphQLUser";
import GraphQLIssue from "../../../nodes/GraphQLIssue";
import GraphQLUnassignedEvent from "../../../nodes/timelineItems/GraphQLUnassignedEvent";
import GraphQLIssueTimelineItemEdge from "../../../edges/GraphQLIssueTimelineItemEdge";

let removeAssigneePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "RemoveAssigneePayload",
    description: "The Payload/Response for the removeAssignee mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        user: {
            type: GraphQLUser,
            description: "The user that was uassigned from the issue"
        },
        issue: {
            type: GraphQLIssue,
            description: "The issue from which the user was unassigned"
        },
        event: {
            type: GraphQLUnassignedEvent,
            description: "The issue timeline event for the uassigning of the user from the issue"
        },
        timelineEdge: {
            type: GraphQLIssueTimelineItemEdge,
            description: "The edge to be able to request other timeline items from this timeline item"
        }
    })
};
let GraphQLRemoveAssigneePayload = new GraphQLObjectType(removeAssigneePayloadConfig);
export default GraphQLRemoveAssigneePayload;