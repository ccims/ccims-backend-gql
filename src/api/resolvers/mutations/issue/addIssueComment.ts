import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLAddIssueCommentPayload from "../../types/mutations/payloads/issue/GraphQLAddIssueCommentPayload";
import GraphQLAddIssueCommentInput from "../../types/mutations/inputs/issue/GraphQLAddIssueCommentInput";
import timelineMutation from "./timelineMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";

function addIssueComment(): GraphQLFieldConfig<any, ResolverContext> {
    const base = timelineMutation(GraphQLAddIssueCommentPayload, GraphQLAddIssueCommentInput, "Creates a new comment on an existing issue");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const { input, cmd } = base.initTimelineMutation(args, context);
            const bodyText = PreconditionCheck.checkString(input, "body", 65536);
            if (bodyText.length <= 0) {
                throw new Error("The body text can't be empty");
            }
            const issue = await base.getIssue(cmd, context, (perm, issueObj) => perm.componentAdmin || perm.moderate || (perm.editIssues && issueObj.createdByProperty.getId() === context.user.id));
            const body = await issue.addIssueComment(bodyText, new Date(), context.user);
            return base.createResult(args, issue, body, { comment: body });
        }
    }
}
export default addIssueComment;