import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLUser from "../../../nodes/GraphQLUser";
import GraphQLIssue from "../../../nodes/GraphQLIssue";
import GraphQLAssignedEvent from "../../../nodes/timelineItems/GraphQLAssignedEvent";
import GraphQLIssueTimelineItemEdge from "../../../edges/GraphQLIssueTimelineItemEdge";

let addAssigneePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "AddAssigneePayload",
    description: "The Payload/Response for the addAssignee mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        assignee: {
            type: GraphQLUser,
            description: "The user that was assigned to the issue"
        },
        issue: {
            type: GraphQLIssue,
            description: "The issue to which the user was assigned"
        },
        event: {
            type: GraphQLAssignedEvent,
            description: "The issue timeline event for the assigning of the user to the issue"
        },
        timelineEdge: {
            type: GraphQLIssueTimelineItemEdge,
            description: "The edge to be able to request other timeline items from this timeline item"
        }
    })
};
let GraphQLAddAssigneePayload = new GraphQLObjectType(addAssigneePayloadConfig);
export default GraphQLAddAssigneePayload;