import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLUpdateLabelPayload from "../../types/mutations/payloads/label/GraphQLUpdateLabelPayload";
import GraphQLUpdateLabelInput from "../../types/mutations/inputs/label/GraphQLUpdateLabelInput";
import { Label } from "../../../../common/nodes/Label";
import baseMutation from "../baseMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import { Color } from "../../../../common/Color";

function updateLabel(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLUpdateLabelPayload, GraphQLUpdateLabelInput, "Updates a Label in the ccims. Fields which are not provided are not updated.");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, permissions => true);
            const labelId = PreconditionCheck.checkString(input, "label", 32);

            const name = PreconditionCheck.checkNullableString(input, "name", 256);
            const description = PreconditionCheck.checkNullableString(input, "description", 65536);
            let color: Color | undefined = input.color;
                             
            //TODO permissions

            const label = await context.dbManager.getNode(labelId);
            if (label === undefined || !(label instanceof Label)) {
                throw new Error("The specified label id is not the id of a valid label");
            }

            if (name !== undefined) {
                label.setName(name, new Date());
            }
            if (description !== undefined) {
                label.setDescription(description, new Date());
            }
            if (color !== undefined) {
                if (!(color instanceof Color)) {
                    color = new Color("#ffffff");
                }
                label.setColor(color, new Date());
            }

            return base.createResult(args, context, { label:label });
        }
    };
}
export default updateLabel;