import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLAddNonFunctionalConstraintToIssuePayload from "../../types/mutations/payloads/issue/GraphQLAddNonFunctionalConstraintToIssuePayload";
import GraphQLAddNonFunctionalConstraintToIssueInput from "../../types/mutations/inputs/issue/GraphQLAddNonFunctionalConstraintToIssueInput";
import timelineMutation from "./timelineMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import { NonFunctionalConstraint } from "../../../../common/nodes/NonFunctionalConstraint";

function addNonFunctionalConstraintToIssue(): GraphQLFieldConfig<any, ResolverContext> {
    const base = timelineMutation(GraphQLAddNonFunctionalConstraintToIssuePayload, GraphQLAddNonFunctionalConstraintToIssueInput, "Adds a NonFunctionalConstraint to an issue");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const { cmd, input } = base.initTimelineMutation(args, context);
            const nonFunctionalConstraintId = PreconditionCheck.checkString(input, "nonFunctionalConstraint", 32);
            
            const nonFunctionalConstraint = await context.dbManager.getNode(nonFunctionalConstraintId);
            if (nonFunctionalConstraint === undefined || !(nonFunctionalConstraint instanceof NonFunctionalConstraint)) {
                throw new Error("The given NonFunctionalConstraint id is not a valid NonFunctionalConstraint id");
            }

            const issue = await nonFunctionalConstraint.issue();
            const event = await issue.addNonFunctionalConstraint(nonFunctionalConstraint, new Date(), context.user);
            return base.createResult(args, issue, event, { nonFunctionalConstraint });
        }
    }
}
export default addNonFunctionalConstraintToIssue;
