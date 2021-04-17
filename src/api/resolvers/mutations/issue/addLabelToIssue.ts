import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLAddLabelToIssuePayload from "../../types/mutations/payloads/issue/GraphQLAddLabelToIssuePayload";
import GraphQLAddLabelToIssueInput from "../../types/mutations/inputs/issue/GraphQLAddLabelToIssueInput";
import timelineMutation from "./timelineMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import { Label } from "../../../../common/nodes/Label";

function addLabelToIssue(): GraphQLFieldConfig<any, ResolverContext> {
    const base = timelineMutation(GraphQLAddLabelToIssuePayload, GraphQLAddLabelToIssueInput, "Adds a label to an issue");
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

            if (!(await Promise.all((await issue.componentsProperty.getIds()).map(comp => label.componentsProperty.hasId(comp)))).some(hasLabel => hasLabel)) {
                throw new Error("The label you are tying to assign is not on at least one of the components the issue is on");
            }
            const event = await issue.addLabel(label, new Date(), context.user);
            return base.createResult(args, issue, event, { label });
        }
    }
}
export default addLabelToIssue;
