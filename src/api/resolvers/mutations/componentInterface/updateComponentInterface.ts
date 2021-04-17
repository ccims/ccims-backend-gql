import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLUpdateComponentInterfacePayload from "../../types/mutations/payloads/componentInterface/GraphQLUpdateComponentInterfacePayload";
import GraphQLUpdateComponentInterfaceInput from "../../types/mutations/inputs/componentInterface/GraphQLUpdateComponentInterfaceInput";
import baseMutation from "../baseMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import { ComponentInterface } from "../../../../common/nodes/ComponentInterface";

function updateComponentInterface(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLUpdateComponentInterfacePayload, GraphQLUpdateComponentInterfaceInput, "Updates the specified ComponentInterface. Fields which are not provided are not updated.");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, perm => true);
            const name = PreconditionCheck.checkNullableString(input, "name", 256);
            const description = PreconditionCheck.checkNullableString(input, "description", 65536);
            const componentInterfaceId = PreconditionCheck.checkString(input, "componentInterface", 32);

            const componentInterface = await context.dbManager.getNode(componentInterfaceId);
            if (componentInterface === undefined || !(componentInterface instanceof ComponentInterface)) {
                throw new Error("The specified componentInterface id is not the id of a valid componentInterface");
            }

            base.userAllowed(context, permissions => permissions.getComponentPermissions(componentInterface.componentProperty.getId()).componentAdmin);

            
            if (name !== undefined) {
                componentInterface.setName(name, new Date());
            }
            if (description !== undefined) {
                componentInterface.setDescription(description, new Date());
            }

            return base.createResult(args, { componentInterface })
        }
    }
}
export default updateComponentInterface;