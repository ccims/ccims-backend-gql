import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLDeleteIssueCommentPayload from "../../types/mutations/payloads/issue/GraphQLDeleteIssueCommentPayload";
import GraphQLDeleteIssueCommentInput from "../../types/mutations/inputs/issue/GraphQLDeleteIssueCommentInput";
import PreconditionCheck from "../../utils/PreconditionCheck";
import { IssueComment } from "../../../../common/nodes/timelineItems/IssueComment";
import baseMutation from "../baseMutation";

function deleteIssueComment(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLDeleteIssueCommentPayload, GraphQLDeleteIssueCommentInput, 
        "Deletes an issue comment.\n\nComments don't get fully deleted but replaced by a\n\n`DeletedComment` (only contains creation/deletion date/user) which is for conversation completness");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, () => true);
            const commentId = PreconditionCheck.checkString(input, "issueComment", 32);
            const comment = await context.dbManager.getNode(commentId);
            if (comment === undefined || !(comment instanceof IssueComment)) {
                throw new Error("The specified issue comment id is not the id of a valid issue comment");
            }
            const issue = await comment.issue()
            const deletedComment = await issue.deleteComment(comment, new Date(), context.user);
            const event = deletedComment;
            return base.createResult(args, context, { 
                deletedComment: deletedComment,
                event: event,
                issue: issue,
                timelineEdge: event ? ({
                    cursor: event.id,
                    node: event
                }) : undefined
            });
        }
    }
}
export default deleteIssueComment;