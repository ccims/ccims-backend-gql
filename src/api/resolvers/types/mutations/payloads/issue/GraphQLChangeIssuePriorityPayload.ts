import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLIssue from "../../../nodes/GraphQLIssue";
import GraphQLPriorityChangedEvent from "../../../nodes/timelineItems/GraphQLPriorityChangedEvent";
import GraphQLIssueTimelineItemEdge from "../../../edges/GraphQLIssueTimelineItemEdge";

const changeIssuePriorityPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "ChangeIssuePriorityPayload",
    description: "The Payload/Response for the changeIssuePriority mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        issue: {
            type: GraphQLIssue,
            description: "The issue of which the priority was changed"
        },
        event: {
            type: GraphQLPriorityChangedEvent,
            description: "The issue timeline event for the changed priority"
        },
        timelineEdge: {
            type: GraphQLIssueTimelineItemEdge,
            description: "The edge to be able to request other timeline items from this timeline item"
        }
    })
};
const GraphQLChangeIssuePriorityPayload = new GraphQLObjectType(changeIssuePriorityPayloadConfig);
export default GraphQLChangeIssuePriorityPayload;