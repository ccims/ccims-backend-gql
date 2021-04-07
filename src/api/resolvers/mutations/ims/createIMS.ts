import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLCreateComponentInput from "../../types/mutations/inputs/component/GraphQLCreateComponentInput";
import { Component } from "../../../../common/nodes/Component";
import baseMutation from "../baseMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import { IMSSystem } from "../../../../common/nodes/IMSSystem";
import GraphQLCreateIMSPayload from "../../types/mutations/payloads/ims/GraphQLCreateIMSPayload";
import { Adapters } from "../../../../sync/adapter/SyncAdapters";

function createIMS(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLCreateIMSPayload, GraphQLCreateComponentInput, "Creates a new IMS in the ccims for the specified component");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, perm => perm.globalPermissions.addRemoveComponents);
            const componentId = PreconditionCheck.checkString(input, "component", 32);
            const imsType = PreconditionCheck.checkString(input, "imsType");
            const apiConnectionData = input.connectionData ?? {};

            const component = await context.dbManager.getNode(componentId);
            if (component === undefined || !(component instanceof Component)) {
                throw new Error("The specified component id is not the id of a valid component");
            }

            const syncAdapter = Adapters.adapterByTag(imsType);
            const connectionData = await syncAdapter.createsIMSConnectionData(apiConnectionData);

            const ims = IMSSystem.create(context.dbManager, component, imsType, connectionData);
            
            await context.dbManager.save();
            return base.createResult(args, { ims });
        }
    };
}
export default createIMS;