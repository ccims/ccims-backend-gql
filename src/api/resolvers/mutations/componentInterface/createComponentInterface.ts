import { GraphQLFieldConfig } from "graphql";
import { Component } from "../../../../common/nodes/Component";
import { ComponentInterface } from "../../../../common/nodes/ComponentInterface";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLCreateComponentInterfaceInput from "../../types/mutations/inputs/componentInterface/GraphQLCreateComponentInterfaceInput";
import GraphQLCreateComponentInterfacePayload from "../../types/mutations/payloads/componentInterface/GraphQLCreateComponentInterfacePayload";
import PreconditionCheck from "../../utils/PreconditionCheck";
import baseMutation from "../baseMutation";


function createComponentInterface(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLCreateComponentInterfacePayload, GraphQLCreateComponentInterfaceInput, "Creates a new componentInterface on the given component");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, perm => true);

            const name = PreconditionCheck.checkString(input, "name", 256);
            const description = PreconditionCheck.checkNullableString(input, "description", 65536) ?? "";
            const componentId = PreconditionCheck.checkString(input, "component", 32);

            base.userAllowed(context, permissions => permissions.getComponentPermissions(componentId).componentAdmin);

            const component = await context.dbManager.getNode(componentId);
            if (component === undefined || !(component instanceof Component)) {
                throw new Error("The specified component id is not the id of a valid component");
            }

            const componentInterface = await ComponentInterface.create(context.dbManager, name, description, component, context.user, new Date());

            await context.dbManager.save();
            return base.createResult(args, { componentInterface })
        }
    };
}
export default createComponentInterface;