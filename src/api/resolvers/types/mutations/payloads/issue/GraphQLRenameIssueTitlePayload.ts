import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLIssue from "../../../nodes/GraphQLIssue";
import GraphQLRenamedTitleEvent from "../../../nodes/timelineItems/GraphQLRenamedTitleEvent";
import GraphQLIssueTimelineItemEdge from "../../../edges/GraphQLIssueTimelineItemEdge";

const renameIssueTitlePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "RenameIssueTitlePayload",
    description: "The Payload/Response for the renameIssueTitle mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        issue: {
            type: GraphQLIssue,
            description: "The issue which was renamed"
        },
        event: {
            type: GraphQLRenamedTitleEvent,
            description: "The issue timeline event for the renaming of the issue"
        },
        timelineEdge: {
            type: GraphQLIssueTimelineItemEdge,
            description: "The edge to be able to request other timeline items from this timeline item"
        }
    })
};
const GraphQLRenameIssueTitlePayload = new GraphQLObjectType(renameIssueTitlePayloadConfig);
export default GraphQLRenameIssueTitlePayload;