import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLUpdateComponentPayload from "../../types/mutations/payloads/component/GraphQLUpdateComponentPayload";
import GraphQLUpdateComponentInput from "../../types/mutations/inputs/component/GraphQLUpdateComponentInput";
import { Component } from "../../../../common/nodes/Component";
import baseMutation from "../baseMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";

function updateComponent(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLUpdateComponentPayload, GraphQLUpdateComponentInput, "Updates a component in the ccims and adds it to the given users");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, perm => perm.globalPermissions.addRemoveComponents);
            const componentId = PreconditionCheck.checkString(input, "componentId", 32);

            const name = PreconditionCheck.checkNullableString(input, "name", 256);
            const description = PreconditionCheck.checkNullableString(input, "description", 65536);            

            base.userAllowed(context, permissions => permissions.getComponentPermissions(componentId).componentAdmin);

            const component = await context.dbManager.getNode(componentId);
            if (component === undefined || !(component instanceof Component)) {
                throw new Error("The specified component id is not the id of a valid component");
            }

            if (name !== undefined) {
                component.name = name;
            }
            if (description !== undefined) {
                component.description = description;
            }

            await context.dbManager.save();
            return base.createResult(args, { component:component });
        }
    };
}
export default updateComponent;