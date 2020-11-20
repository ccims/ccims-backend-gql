import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLIssue from "../../../nodes/GraphQLIssue";
import GraphQLCategoryChangedEvent from "../../../nodes/timelineItems/GraphQLCategoryChangedEvent";
import GraphQLIssueTimelineItemEdge from "../../../edges/GraphQLIssueTimelineItemEdge";

const changeIssueCategoryPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "ChangeIssueCategoryPayload",
    description: "The Payload/Response for the changeIssueCategory mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        issue: {
            type: GraphQLIssue,
            description: "The issue of whichthe category was changed"
        },
        event: {
            type: GraphQLCategoryChangedEvent,
            description: "The issue timeline event for the changed category"
        },
        timelineEdge: {
            type: GraphQLIssueTimelineItemEdge,
            description: "The edge to be able to request other timeline items from this timeline item"
        }
    })
};
const GraphQLChangeIssueCategoryPayload = new GraphQLObjectType(changeIssueCategoryPayloadConfig);
export default GraphQLChangeIssueCategoryPayload;