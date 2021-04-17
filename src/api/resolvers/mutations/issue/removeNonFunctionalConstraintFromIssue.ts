import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import timelineMutation from "./timelineMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import GraphQLRemoveNonFunctionalConstraintFromIssuePayload from "../../types/mutations/payloads/issue/GraphQLRemoveNonFunctionalConstraintFromIssuePayload";
import GraphQLRemoveNonFunctionalConstraintFromIssueInput from "../../types/mutations/inputs/issue/GraphQLRemoveNonFunctionalConstraintFromIssueInput";
import { NonFunctionalConstraint } from "../../../../common/nodes/NonFunctionalConstraint";

function removeNonFunctionalConstraintFromIssue(): GraphQLFieldConfig<any, ResolverContext> {
    const base = timelineMutation(GraphQLRemoveNonFunctionalConstraintFromIssuePayload, GraphQLRemoveNonFunctionalConstraintFromIssueInput, "Remove a nonFunctionalConstraint from an issue");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const { cmd, input } = base.initTimelineMutation(args, context);
            const nonFunctionalConstraintId = PreconditionCheck.checkString(input, "nonFunctionalConstraint", 32);

            const nonFunctionalConstraint = await context.dbManager.getNode(nonFunctionalConstraintId);
            if (nonFunctionalConstraint === undefined || !(nonFunctionalConstraint instanceof NonFunctionalConstraint)) {
                throw new Error("The given nonFunctionalConstraint id is not a valid nonFunctionalConstraint id");
            }
            const issue = await nonFunctionalConstraint.issue();
            
            const event = await issue.removeNonFunctionalConstraint(nonFunctionalConstraint, new Date(), context.user);
            return base.createResult(args, issue, event, { nonFunctionalConstraint });
        }
    }
}
export default removeNonFunctionalConstraintFromIssue;
