import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import PreconditionCheck from "../../utils/PreconditionCheck";
import baseMutation from "../baseMutation";
import GraphQLUpdateCommentPayload from "../../types/mutations/payloads/issue/GraphQLUpdateCommentMutation";
import GraphQLUpdateCommentInput from "../../types/mutations/inputs/issue/GraphQLUpdateCommentInput";
import { CommentIssueTimelineItem } from "../../../../common/nodes/timelineItems/CommentIssueTimelineItem";

function updateComment(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLUpdateCommentPayload, GraphQLUpdateCommentInput, "Updates a Comment. Fields which are not provided are not updated.");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, perm => true);
            const bodyText = PreconditionCheck.checkString(input, "body", 65536);
            if (bodyText.length <= 0) {
                throw new Error("The body text can't be empty");
            }
            
            const comment = await context.dbManager.getNode(input.comment);
            if (comment === undefined || !(comment instanceof CommentIssueTimelineItem)) {
                throw new Error("The given comment id is not a valid comment id");
            }

            const componentIds = await (await comment.issue()).componentsProperty.getIds();

            base.userAllowed(context, permissions => comment.createdByProperty.getId() == context.user.id 
                || componentIds.map(permissions.getComponentPermissions).some(perm => perm.componentAdmin || perm.moderate));

            await comment.setBody(bodyText, new Date(), context.user);
            await context.dbManager.save();
            return base.createResult(args, { comment: comment });
        }
    }
}
export default updateComment;