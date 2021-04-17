import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import baseMutation from "../baseMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import { NonFunctionalConstraint } from "../../../../common/nodes/NonFunctionalConstraint";
import GraphQLCreateNonFunctionalConstraintInput from "../../types/mutations/inputs/nonFunctionalConstraint/GraphQLCreateNonFunctionalConstraintInput";
import GraphQLCreateNonFunctionalConstraintPayload from "../../types/mutations/payloads/nonFunctionalConstraint/GraphQLCreateNonFunctionalConstraintPayload";
import { Issue } from "../../../../common/nodes/Issue";

function createNonFunctionalConstraint(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLCreateNonFunctionalConstraintPayload, GraphQLCreateNonFunctionalConstraintInput, "Create a new NonFunctionalConstraint in the system");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.argsCheck(args);
            const content = PreconditionCheck.checkString(input, "content", 65536);
            const description = PreconditionCheck.checkNullableString(input, "description", 65536) ?? "";
            const issueId = PreconditionCheck.checkString(input, "issue", 32);

            //TODO permissions

            const issue = await context.dbManager.getNode(issueId);
            if (issue === undefined || !(issue instanceof Issue)) {
                throw new Error("The given component id is not a valid component id");
            }

            const nonFunctionalConstraint = await NonFunctionalConstraint.create(context.dbManager, issue, content, description, context.user, new Date());
            nonFunctionalConstraint.isActive = false;
            console.log(nonFunctionalConstraint);
            const event = await issue.addNonFunctionalConstraint(nonFunctionalConstraint, nonFunctionalConstraint.createdAt, context.user);
            return base.createResult(args, context, { nonFunctionalConstraint: nonFunctionalConstraint, addedEvent: event });
        }
    }
}
export default createNonFunctionalConstraint;