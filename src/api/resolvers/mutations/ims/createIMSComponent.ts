import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import { Component } from "../../../../common/nodes/Component";
import baseMutation from "../baseMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import { IMSSystem } from "../../../../common/nodes/IMSSystem";
import { Adapters } from "../../../../sync/adapter/SyncAdapters";
import GraphQLCreateIMSComponentPayload from "../../types/mutations/payloads/ims/GraphQLCreateIMSComponentPayload";
import GraphQLCreateIMSComponentInput from "../../types/mutations/inputs/ims/GraphQLCreateIMSComponentInput";

function createIMSComponent(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLCreateIMSComponentPayload, GraphQLCreateIMSComponentInput, "Creates a new IMSComponent which links the specified component to the specified IMS");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, perm => perm.globalPermissions.addRemoveComponents);
            const componentId = PreconditionCheck.checkString(input, "component", 32);
            const imsId = PreconditionCheck.checkString(input, "ims", 32);
            const apiIMSData = input.connectionData ?? {};

            const component = await context.dbManager.getNode(componentId);
            if (component === undefined || !(component instanceof Component)) {
                throw new Error("The specified component id is not the id of a valid Component");
            }

            const ims = await context.dbManager.getNode(imsId);
            if (ims === undefined || !(ims instanceof IMSSystem)) {
                throw new Error("The specified ims id is not the id of a valid IMS");
            }

            const syncAdapter = Adapters.adapterByTag(ims.imsType);
            const imsComponent = await syncAdapter.linkComponentToIMS(component, ims, apiIMSData);
            
            return base.createResult(args, context, { imsComponent });
        }
    };
}
export default createIMSComponent;