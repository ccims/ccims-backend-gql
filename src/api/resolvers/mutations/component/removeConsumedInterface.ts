import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import baseMutation from "../baseMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import GraphQLRemoveConsumedInterfacePayload from "../../types/mutations/payloads/component/GraphQLRemoveConsumedInterfacePayload";
import GraphQLRemoveConsumedInterfaceInput from "../../types/mutations/inputs/component/GraphQLRemoveConsumedInterfaceInput";
import { Component } from "../../../../common/nodes/Component";
import { ComponentInterface } from "../../../../common/nodes/ComponentInterface";

function removeConsumedInterface(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLRemoveConsumedInterfacePayload, GraphQLRemoveConsumedInterfaceInput, "Removes the specified component to the project if it is not already on the project");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, perm => true);
            const componentId = PreconditionCheck.checkString(input, "componentId", 32);
            const interfaceId = PreconditionCheck.checkString(input, "interfaceId", 32);

            base.userAllowed(context, permissions => permissions.getComponentPermissions(componentId).componentAdmin);

            const component = await context.dbManager.getNode(componentId);
            if (component === undefined || !(component instanceof Component)) {
                throw new Error("The given component id is not a valid component id");
            }

            const componentInterface = await context.dbManager.getNode(interfaceId);
            if (componentInterface === undefined || !(componentInterface instanceof ComponentInterface)) {
                throw new Error("The given interface id is not a valid component interface id");
            }

            if (await component.consumedInterfacesProperty.hasId(interfaceId)) {
                await component.consumedInterfacesProperty.remove(componentInterface);
                return base.createResult(args, { component:component, interface:componentInterface });
            } else {
                throw new Error("The specified component does not consume the specified interface")
            }

        }
    };
}
export default removeConsumedInterface;