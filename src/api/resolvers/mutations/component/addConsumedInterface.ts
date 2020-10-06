import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import baseMutation from "../baseMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import { log } from "../../../../log";
import GraphQLAddConsumedInterfacePayload from "../../types/mutations/payloads/component/GraphQLAddConsumedInterfacePayload";
import GraphQLAddConsumedInterfaceInput from "../../types/mutations/inputs/component/GraphQLAddConsumedInterfaceInput";
import { Component } from "../../../../common/nodes/Component";
import { ComponentInterface } from "../../../../common/nodes/ComponentInterface";

function addConsumedInterface(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLAddConsumedInterfacePayload, GraphQLAddConsumedInterfaceInput, "Adds the specified component to the project if it is not already on the project");
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

            if (!(await component.consumedInterfacesProperty.hasId(interfaceId))) {
                await component.consumedInterfacesProperty.add(componentInterface);
                await context.dbManager.save();
                return base.createResult(args, { component:component, interface:componentInterface });
            } else {
                log(5, `tried to add componentInterface ${interfaceId} which was already on component ${componentId}`);
                return base.createResult(args, { });
            }

        }
    };
}
export default addConsumedInterface;