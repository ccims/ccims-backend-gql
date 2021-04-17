import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import baseMutation from "../baseMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import GraphQLDeleteIssuePayload from "../../types/mutations/payloads/issue/GraphQLDeleteIssuePayload";
import GraphQLDeleteIssueInput from "../../types/mutations/inputs/issue/GraphQLDeleteIssueInput";
import { Issue } from "../../../../common/nodes/Issue";

function deleteIssue(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLDeleteIssuePayload, GraphQLDeleteIssueInput, "Delets the specified issue");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, perm => true);
            const issueId = PreconditionCheck.checkString(input, "issue", 32);

            const issue = await context.dbManager.getNode(issueId);
            if (issue === undefined || !(issue instanceof Issue)) {
                throw new Error("The specified issue id is not the id of a valid issue");
            }

            //TODO permissions

            await issue.markDeleted();
            return base.createResult(args, {  });
        }
    };
}
export default deleteIssue;