import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLIssue from "../../../nodes/GraphQLIssue";
import GraphQLLinkEvent from "../../../nodes/timelineItems/GraphQLLinkEvent";
import GraphQLIssueTimelineItemEdge from "../../../edges/GraphQLIssueTimelineItemEdge";

const linkIssuePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "LinkIssuePayload",
    description: "The Payload/Response for the linkIssue mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        linkedIssue: {
            type: GraphQLIssue,
            description: "The issue the `issue` was linked to (the __destination__ of the relation)"
        },
        issue: {
            type: GraphQLIssue,
            description: "The issue which was linked to the `linkedIssue` (the __origin__ of the relation)"
        },
        event: {
            type: GraphQLLinkEvent,
            description: "The issue timeline event for the linking of the issues"
        },
        timelineEdge: {
            type: GraphQLIssueTimelineItemEdge,
            description: "The edge to be able to request other timeline items from this timeline item"
        }
    })
};
const GraphQLLinkIssuePayload = new GraphQLObjectType(linkIssuePayloadConfig);
export default GraphQLLinkIssuePayload;