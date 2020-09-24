import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLCloseIssuePayload from "../../types/mutations/payloads/issue/GraphQLCloseIssuePayload";
import GraphQLCloseIssueInput from "../../types/mutations/inputs/issue/GraphQLCloseIssueInput";
import timelineMutation from "./timelineMutation";

function closeIssue(): GraphQLFieldConfig<any, ResolverContext> {
    const base = timelineMutation(GraphQLCloseIssuePayload, GraphQLCloseIssueInput, "Closes an open issue");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const { input, cmd } = base.initTimelineMutation(args, context);
            const issue = await base.getIssue(cmd, context, (perm, issueObj) => perm.componentAdmin || perm.moderate || (perm.editIssues && issueObj.createdByProperty.getId() === context.user.id));
            const event = await issue.close(new Date(), context.user);
            await context.dbManager.save();
            return base.createResult(args, issue, event, {});
        }
    }
}
export default closeIssue;