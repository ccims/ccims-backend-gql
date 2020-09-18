import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLIssue from "../../../nodes/GraphQLIssue";
import GraphQLStartDateChangedEvent from "../../../nodes/timelineItems/GraphQLStartDateChangedEvent";
import GraphQLIssueTimelineItemEdge from "../../../edges/GraphQLIssueTimelineItemEdge";

const changeIssueStartDatePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "ChangeIssueStartDatePayload",
    description: "The Payload/Response for the changeIssueStartDate mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        issue: {
            type: GraphQLIssue,
            description: "The issue of which the start date was updated"
        },
        event: {
            type: GraphQLStartDateChangedEvent,
            description: "The issue timeline event for the changing start date"
        },
        timelineEdge: {
            type: GraphQLIssueTimelineItemEdge,
            description: "The edge to be able to request other timeline items from this timeline item"
        }
    })
};
const GraphQLChangeIssueStartDatePayload = new GraphQLObjectType(changeIssueStartDatePayloadConfig);
export default GraphQLChangeIssueStartDatePayload;