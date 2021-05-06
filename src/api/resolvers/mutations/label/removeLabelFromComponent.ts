import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import baseMutation from "../baseMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import GraphQLRemoveLabelFromComponentPayload from "../../types/mutations/payloads/label/GraphQLRemoveLabelFromComponentPayload";
import GraphQLRemoveLabelFromComponentInput from "../../types/mutations/inputs/label/GraphQLRemoveLabelFromComponentInput";
import { Label } from "../../../../common/nodes/Label";
import { Component } from "../../../../common/nodes/Component";

function removeLabelFromComponent(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLRemoveLabelFromComponentPayload, GraphQLRemoveLabelFromComponentInput, "Removes the specified label from the component if it is on the component");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, perm => true);
            const componentId = PreconditionCheck.checkString(input, "component", 32);
            const labelId = PreconditionCheck.checkString(input, "label", 32);

            //TODO permissions

            const label = await context.dbManager.getNode(labelId);
            if (label === undefined || !(label instanceof Label)) {
                throw new Error("The given label id is not a valid label id");
            }

            const component = await context.dbManager.getNode(componentId);
            if (component === undefined || !(component instanceof Component)) {
                throw new Error("The given component id is not a valid label component id");
            }

            if (await component.labelsProperty.hasId(labelId)) {
                await component.labelsProperty.remove(label);
                return base.createResult(args, context, { component, label });
            } else {
                throw new Error("The specified label is not on the specified component");
            }

        }
    };
}
export default removeLabelFromComponent;