import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLCreateComponentInput from "../../types/mutations/inputs/component/GraphQLCreateComponentInput";
import { Component } from "../../../../common/nodes/Component";
import baseMutation from "../baseMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import { IMSSystem } from "../../../../common/nodes/IMSSystem";
import GraphQLCreateIMSPayload from "../../types/mutations/payloads/ims/GraphQLCreateIMSPayload";
import { Adapters } from "../../../../sync/adapter/SyncAdapters";
import { LoadIMSComponentsCommand } from "../../../../common/database/commands/load/nodes/LoadIMSComponentsCommand";

function createIMSComponent(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLCreateIMSPayload, GraphQLCreateComponentInput, "Creates a new IMSComponent which links the specified component to the specified IMS");
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

            const loadImsComponentCommand = new LoadIMSComponentsCommand();
            loadImsComponentCommand.imsSystems = [ims.id];
            loadImsComponentCommand.components = [component.id];
            context.dbManager.addCommand(loadImsComponentCommand);
            await context.dbManager.executePendingCommands();
            if (loadImsComponentCommand.getResult().length > 0) {
                throw new Error("There is already a IMSComponent which links the specified IMS to the specified Component")
            }

            const syncAdapter = Adapters.adapterByTag(ims.type);
            const imsComponent = await syncAdapter.linkComponentToIMS(component, ims, apiIMSData);
            
            await context.dbManager.save();
            return base.createResult(args, { imsComponent });
        }
    };
}
export default createIMSComponent;