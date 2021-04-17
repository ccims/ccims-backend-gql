import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import timelineMutation from "./timelineMutation";
import GraphQLReopenIssueInput from "../../types/mutations/inputs/issue/GraphQLReopenIssueInput";
import GraphQLReopenIssuePayload from "../../types/mutations/payloads/issue/GraphQLReopenIssuePayload";

function reopenIssue(): GraphQLFieldConfig<any, ResolverContext> {
    const base = timelineMutation(GraphQLReopenIssuePayload, GraphQLReopenIssueInput, "Reopen an open issue");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const { input, cmd } = base.initTimelineMutation(args, context);
            const issue = await base.getIssue(cmd, context, (perm, issueObj) => perm.componentAdmin || perm.moderate || (perm.editIssues && issueObj.createdByProperty.getId() === context.user.id));
            const event = await issue.reopen(new Date(), context.user);
            return base.createResult(args, issue, event, {});
        }
    }
}
export default reopenIssue;