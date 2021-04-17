import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLChangeIssueStartDatePayload from "../../types/mutations/payloads/issue/GraphQLChangeIssueStartDatePayload";
import GraphQLChangeIssueStartDateInput from "../../types/mutations/inputs/issue/GraphQLChangeIssueStartDateInput";
import timelineMutation from "./timelineMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";

function changeIssueStartDate(): GraphQLFieldConfig<any, ResolverContext> {
    const base = timelineMutation(GraphQLChangeIssueStartDatePayload, GraphQLChangeIssueStartDateInput, "Changes the set start date on an issue");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const { input, cmd } = base.initTimelineMutation(args, context);
            const startDate = PreconditionCheck.checkDate(input, "newStartDate");
            const issue = await base.getIssue(cmd, context, (perm, issueObj) => perm.componentAdmin || perm.moderate || (perm.editIssues && issueObj.createdByProperty.getId() === context.user.id));
            const event = await issue.changeStartDate(startDate, new Date(), context.user);
            
            return base.createResult(args, issue, event, {});
        }
    }
}
export default changeIssueStartDate;