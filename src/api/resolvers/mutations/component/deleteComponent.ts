import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import baseMutation from "../baseMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import GraphQLDeleteComponentPayload from "../../types/mutations/payloads/component/GraphQLDeleteComponentPayload";
import GraphQLDeleteComponentInput from "../../types/mutations/inputs/component/GraphQLDeleteComponentInput";
import { Component } from "../../../../common/nodes/Component";

function deleteComponent(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLDeleteComponentPayload, GraphQLDeleteComponentInput, "Delets the specified component");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, perm => true);
            const componentId = PreconditionCheck.checkString(input, "componentId", 32);

            const component = await context.dbManager.getNode(componentId);
            if (component === undefined || !(component instanceof Component)) {
                throw new Error("The specified component id is not the id of a valid component");
            }

            base.userAllowed(context, permissions => permissions.getComponentPermissions(component.id).componentAdmin);

            await component.markDeleted();
            return base.createResult(args, {  });
        }
    };
}
export default deleteComponent;