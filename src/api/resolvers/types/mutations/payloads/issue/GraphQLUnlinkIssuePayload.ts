import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLIssue from "../../../nodes/GraphQLIssue";
import GraphQLIssueTimelineItemEdge from "../../../edges/GraphQLIssueTimelineItemEdge";
import GraphQLUnlinkEvent from "../../../nodes/timelineItems/GraphQLUnlinkEvent";

const unlinkIssuePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "UnlinkIssuePayload",
    description: "The Payload/Response for the unlinkIssue mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        issue: {
            type: GraphQLIssue,
            description: "The issue which was unlinked (the former __origin__ of the relation)"
        },
        event: {
            type: GraphQLUnlinkEvent,
            description: "The issue timeline event for the unlinking of the issue"
        },
        timelineEdge: {
            type: GraphQLIssueTimelineItemEdge,
            description: "The edge to be able to request other timeline items from this timeline item"
        }
    })
};
const GraphQLUnlinkIssuePayload = new GraphQLObjectType(unlinkIssuePayloadConfig);
export default GraphQLUnlinkIssuePayload;