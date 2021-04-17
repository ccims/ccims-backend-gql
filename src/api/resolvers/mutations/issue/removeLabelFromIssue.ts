import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import timelineMutation from "./timelineMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import GraphQLRemoveLabelFromIssuePayload from "../../types/mutations/payloads/issue/GraphQLRemoveLabelFromIssuePayload";
import GraphQLRemoveLabelFromIssueInput from "../../types/mutations/inputs/issue/GraphQLRemoveLabelFromIssueInput";
import { Label } from "../../../../common/nodes/Label";

function removeLabelFromIssue(): GraphQLFieldConfig<any, ResolverContext> {
    const base = timelineMutation(GraphQLRemoveLabelFromIssuePayload, GraphQLRemoveLabelFromIssueInput, "Remove a label from an issue");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const { cmd, input } = base.initTimelineMutation(args, context);
            const labelId = PreconditionCheck.checkString(input, "label", 32);

            const label = await context.dbManager.getNode(labelId);
            if (label === undefined || !(label instanceof Label)) {
                throw new Error("The given label id is not a valid label id");
            }
            const issue = await base.getIssue(cmd, context, (perm, issueObj) => perm.componentAdmin || perm.moderate || (perm.editIssues && issueObj.createdByProperty.getId() === context.user.id));
            
            const event = await issue.removeLabel(label, new Date(), context.user);
            return base.createResult(args, context, issue, event, { label });
        }
    }
}
export default removeLabelFromIssue;
