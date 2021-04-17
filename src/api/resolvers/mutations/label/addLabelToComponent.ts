import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import baseMutation from "../baseMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import { log } from "../../../../log";

import { Label } from "../../../../common/nodes/Label";
import { Component } from "../../../../common/nodes/Component";
import GraphQLAddLabelToComponentPayload from "../../types/mutations/payloads/label/GraphQLAddLabelToComponentPayload";
import GraphQLAddLabelToComponentInput from "../../types/mutations/inputs/label/GraphQLAddLabelToComponentInput";

function addLabelToComponent(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLAddLabelToComponentPayload, GraphQLAddLabelToComponentInput, "Adds the specified label to the component if it is not already on the component");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, perm => true);
            const labelId = PreconditionCheck.checkString(input, "label", 32);
            const componentId = PreconditionCheck.checkString(input, "component", 32);

            //TODO permissions

            const label = await context.dbManager.getNode(labelId);
            if (label === undefined || !(label instanceof Label)) {
                throw new Error("The given label id is not a valid label id");
            }

            const component = await context.dbManager.getNode(componentId);
            if (component === undefined || !(component instanceof Component)) {
                throw new Error("The given component id is not a valid component id");
            }

            if (!(await label.componentsProperty.hasId(componentId))) {
                await label.componentsProperty.add(component);
                return base.createResult(args, context, { label:label, component:component });
            } else {
                log(5, `tried to add label ${labelId} which was already on component ${componentId}`);
                return base.createResult(args, context, { });
            }

        }
    };
}
export default addLabelToComponent;