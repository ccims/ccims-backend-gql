import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import timelineMutation from "./timelineMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import { LoadLabelsCommand } from "../../../../common/database/commands/load/nodes/LoadLabelsCommand";
import GraphQLRemoveLabelFromIssuePayload from "../../types/mutations/payloads/issue/GraphQLRemoveLabelFromIssuePayload";
import GraphQLRemoveLabelFromIssueInput from "../../types/mutations/inputs/issue/GraphQLRemoveLabelFromIssueInput";

function removeLabelFromIssue(): GraphQLFieldConfig<any, ResolverContext> {
    const base = timelineMutation(GraphQLRemoveLabelFromIssuePayload, GraphQLRemoveLabelFromIssueInput, "Remove a label from an issue");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const { cmd, input } = base.initTimelineMutation(args, context);
            const labelId = PreconditionCheck.checkString(input, "label", 32);
            const labelCmd = new LoadLabelsCommand();
            labelCmd.ids = [labelId];
            context.dbManager.addCommand(labelCmd);
            const issue = await base.getIssue(cmd, context, (perm, issueObj) => perm.componentAdmin || perm.moderate || (perm.editIssues && issueObj.createdByProperty.getId() === context.user.id));
            if (labelCmd.getResult().length !== 1) {
                throw new Error("The given id was no valid label id");
            }
            const label = labelCmd.getResult()[0];
            
            const event = await issue.removeLabel(label, new Date(), context.user);
            await context.dbManager.save();
            return base.createResult(args, issue, event, { label });
        }
    }
}
export default removeLabelFromIssue;
