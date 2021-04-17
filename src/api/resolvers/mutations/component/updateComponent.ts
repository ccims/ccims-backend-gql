import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLUpdateComponentPayload from "../../types/mutations/payloads/component/GraphQLUpdateComponentPayload";
import GraphQLUpdateComponentInput from "../../types/mutations/inputs/component/GraphQLUpdateComponentInput";
import { Component } from "../../../../common/nodes/Component";
import baseMutation from "../baseMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";

function updateComponent(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLUpdateComponentPayload, GraphQLUpdateComponentInput, "Updates a Component in the ccims. Fields which are not provided are not updated.");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, perm => perm.globalPermissions.addRemoveComponents);
            const componentId = PreconditionCheck.checkString(input, "component", 32);

            const name = PreconditionCheck.checkNullableString(input, "name", 256);
            const description = PreconditionCheck.checkNullableString(input, "description", 65536);  
            const repositoryURL = PreconditionCheck.checkNullableString(input, "repositoryURL", 65536);                      

            base.userAllowed(context, permissions => permissions.getComponentPermissions(componentId).componentAdmin);

            const component = await context.dbManager.getNode(componentId);
            if (component === undefined || !(component instanceof Component)) {
                throw new Error("The specified component id is not the id of a valid component");
            }

            if (name !== undefined) {
                component.setName(name, new Date());
            }
            if (description !== undefined) {
                component.setDescription(description, new Date());
            }
            if (repositoryURL !== undefined) {
                component.setRepositoryURL(repositoryURL, new Date());
            }

            return base.createResult(args, { component:component });
        }
    };
}
export default updateComponent;