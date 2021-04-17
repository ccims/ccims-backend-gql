import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLChangeIssueDueDatePayload from "../../types/mutations/payloads/issue/GraphQLChangeIssueDueDatePayload";
import GraphQLChangeIssueDueDateInput from "../../types/mutations/inputs/issue/GraphQLChangeIssueDueDateInput";
import timelineMutation from "./timelineMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";

function changeIssueDueDate(): GraphQLFieldConfig<any, ResolverContext> {
    const base = timelineMutation(GraphQLChangeIssueDueDatePayload, GraphQLChangeIssueDueDateInput, "Changes the set due date on an issue");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const { input, cmd } = base.initTimelineMutation(args, context);
            const dueDate = PreconditionCheck.checkDate(input, "newDueDate");
            const issue = await base.getIssue(cmd, context, (perm, issueObj) => perm.componentAdmin || perm.moderate || (perm.editIssues && issueObj.createdByProperty.getId() === context.user.id));
            const event = await issue.changeDueDate(dueDate, new Date(), context.user);
            
            return base.createResult(args, issue, event, {});
        }
    }
}
export default changeIssueDueDate;