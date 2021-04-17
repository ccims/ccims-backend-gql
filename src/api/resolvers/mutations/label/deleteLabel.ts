import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import baseMutation from "../baseMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import GraphQLDeleteLabelPayload from "../../types/mutations/payloads/label/GraphQLDeleteLabelPayload";
import GraphQLDeleteLabelInput from "../../types/mutations/inputs/label/GraphQLDeleteLabelInput";
import { Label } from "../../../../common/nodes/Label";

function deleteLabel(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLDeleteLabelPayload, GraphQLDeleteLabelInput, "Delets the specified label");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, perm => true);
            const labelId = PreconditionCheck.checkString(input, "labelId", 32);

            const label = await context.dbManager.getNode(labelId);
            if (label === undefined || !(label instanceof Label)) {
                throw new Error("The specified label id is not the id of a valid label");
            }

            //TODO permissions

            await label.markDeleted();
            return base.createResult(args, {  });
        }
    };
}
export default deleteLabel;