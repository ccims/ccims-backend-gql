import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { DeletedIssueComment } from "../../../../../common/nodes/timelineItems/DeletedIssueComment";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLUser from "../GraphQLUser";
import GraphQLDate from "../../../scalars/GraphQLDate";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";

const deletedIssueCommentConfig: GraphQLObjectTypeConfig<DeletedIssueComment, ResolverContext> = {
    name: "DeletedIssueComment",
    description: "An DeletedIssueComment in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<DeletedIssueComment>("DeletedIssueComment"),
        deletedBy: {
            type: GraphQLUser,
            description: "The user who __deleted__ the comment"
        },
        deletedAt: {
            type: GraphQLDate,
            description: "The date the comment was deleted"
        }
    })
};
const GraphQLDeletedIssueComment = new GraphQLObjectType(deletedIssueCommentConfig);
export default GraphQLDeletedIssueComment;