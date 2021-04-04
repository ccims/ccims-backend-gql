import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLUpdateComponentPayload from "../../types/mutations/payloads/component/GraphQLUpdateComponentPayload";
import GraphQLUpdateComponentInput from "../../types/mutations/inputs/component/GraphQLUpdateComponentInput";
import { Component } from "../../../../common/nodes/Component";
import baseMutation from "../baseMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import { IMSSystem } from "../../../../common/nodes/IMSSystem";
import { log } from "../../../../log";
import { IMSType } from "../../../../common/nodes/enums/IMSType";

function updateComponent(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLUpdateComponentPayload, GraphQLUpdateComponentInput, "Updates a component in the ccims and adds it to the given users");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, perm => perm.globalPermissions.addRemoveComponents);
            const componentId = PreconditionCheck.checkString(input, "componentId", 32);
            const imsType = PreconditionCheck.checkNullableEnum<IMSType>(input, "imsType", IMSType);
            const endpoint = PreconditionCheck.checkNullableString(input, "endpoint");
            const connectionData = input.connectionData; // TODO: Check that Connection data

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

            let imsSystem = await component.ims();
            if (imsType !== undefined || endpoint !== undefined || connectionData !== undefined) {
                if (component.imsSystemProperty.getId() === undefined) {
                    await component.imsSystemProperty.set(IMSSystem.create(context.dbManager, imsType ?? IMSType.CCIMS, endpoint ?? "", connectionData ?? {}));
                }
                imsSystem = await component.ims();
                if (imsSystem === undefined) {
                    log(2, "imsSystem was still undefined");
                    throw new Error("Internal server error");
                }
                
                if (imsType !== undefined) {
                    imsSystem.imsType = imsType;
                }
                if (endpoint !== undefined) {
                    imsSystem.endpoint = endpoint;
                }
                if (connectionData !== undefined) {
                    imsSystem.connectionData = connectionData;
                }
            }

            await context.dbManager.save();
            return base.createResult(args, { component:component, ims:imsSystem });
        }
    };
}
export default updateComponent;