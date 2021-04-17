import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import baseMutation from "../baseMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import GraphQLDeleteNonFunctionalConstraintPayload from "../../types/mutations/payloads/nonFunctionalConstraint/GraphQLDeleteNonFunctionalConstraintPayload";
import GraphQLDeleteNonFunctionalConstraintInput from "../../types/mutations/inputs/nonFunctionalConstraint/GraphQLDeleteNonFunctionalConstraintInput";
import { NonFunctionalConstraint } from "../../../../common/nodes/NonFunctionalConstraint";

function deleteNonFunctionalConstraint(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLDeleteNonFunctionalConstraintPayload, GraphQLDeleteNonFunctionalConstraintInput, "Delets the specified NonFunctionalConstraint");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, perm => true);
            const nonFunctionalConstraintId = PreconditionCheck.checkString(input, "NonFunctionalConstraintId", 32);

            const nonFunctionalConstraint = await context.dbManager.getNode(nonFunctionalConstraintId);
            if (NonFunctionalConstraint === undefined || !(nonFunctionalConstraint instanceof NonFunctionalConstraint)) {
                throw new Error("The specified NonFunctionalConstraint id is not the id of a valid NonFunctionalConstraint");
            }

            //TODO permissions

            await nonFunctionalConstraint.markDeleted();
            return base.createResult(args, {  });
        }
    };
}
export default deleteNonFunctionalConstraint;