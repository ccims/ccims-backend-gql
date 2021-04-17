import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLUpdateNonFunctionalConstraintPayload from "../../types/mutations/payloads/nonFunctionalConstraint/GraphQLUpdateNonFunctionalConstraintPayload";
import { NonFunctionalConstraint } from "../../../../common/nodes/NonFunctionalConstraint";
import baseMutation from "../baseMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import GraphQLUpdateNonFunctionalConstraintInput from "../../types/mutations/inputs/nonFunctionalConstraint/GraphQLUpdateNonFunctionalConstraintInput";

function updateNonFunctionalConstraint(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLUpdateNonFunctionalConstraintPayload, GraphQLUpdateNonFunctionalConstraintInput, "Updates a NonFunctionalConstraint in the ccims. Fields which are not provided are not updated.");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, perm => true);
            const nonFunctionalConstraintId = PreconditionCheck.checkString(input, "nonFunctionalConstraint", 32);

            const content = PreconditionCheck.checkNullableString(input, "content", 65536);
            const description = PreconditionCheck.checkNullableString(input, "description", 65536); 

            //TODO permissions

            const nonFunctionalConstraint = await context.dbManager.getNode(nonFunctionalConstraintId);
            if (nonFunctionalConstraint === undefined || !(nonFunctionalConstraint instanceof NonFunctionalConstraint)) {
                throw new Error("The specified NonFunctionalConstraint id is not the id of a valid NonFunctionalConstraint");
            }

            if (content !== undefined) {
                await nonFunctionalConstraint.setContent(content, new Date());
            }
            if (description !== undefined) {
                await nonFunctionalConstraint.setDescription(description, new Date());
            }

            return base.createResult(args, context, { nonFunctionalConstraint: nonFunctionalConstraint });
        }
    };
}
export default updateNonFunctionalConstraint;