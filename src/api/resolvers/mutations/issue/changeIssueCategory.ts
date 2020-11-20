import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLChangeIssueCategoryPayload from "../../types/mutations/payloads/issue/GraphQLChangeIssueCategoryPayload";
import GraphQLChangeIssueCategoryInput from "../../types/mutations/inputs/issue/GraphQLChangeIssueCategoryInput";
import timelineMutation from "./timelineMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import { IssueCategory } from "../../../../common/nodes/Issue";

function changeIssueCategory(): GraphQLFieldConfig<any, ResolverContext> {
    const base = timelineMutation(GraphQLChangeIssueCategoryPayload, GraphQLChangeIssueCategoryInput, "Changes the category of an issue");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const { cmd, input } = base.initTimelineMutation(args, context);
            const category = PreconditionCheck.checkEnum<IssueCategory>(input, "newCategory", IssueCategory);
            const issue = await base.getIssue(cmd, context, (perm, issueObj) => perm.componentAdmin || perm.moderate || (perm.editIssues && issueObj.createdByProperty.getId() === context.user.id));
            const event = await issue.changeCategory(category, new Date(), context.user);
            await context.dbManager.save();
            return base.createResult(args, issue, event, {});
        }
    }
}
export default changeIssueCategory;
