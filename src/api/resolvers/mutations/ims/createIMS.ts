import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import baseMutation from "../baseMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import { IMSSystem } from "../../../../common/nodes/IMSSystem";
import GraphQLCreateIMSPayload from "../../types/mutations/payloads/ims/GraphQLCreateIMSPayload";
import { Adapters } from "../../../../sync/adapter/SyncAdapters";
import GraphQLCreateIMSInput from "../../types/mutations/inputs/ims/GraphQLCreateIMSInput";

function createIMS(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLCreateIMSPayload, GraphQLCreateIMSInput, "Creates a new IMS in the ccims for the specified component");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, perm => perm.globalPermissions.addRemoveComponents);
            const imsType = PreconditionCheck.checkString(input, "imsType");
            const apiIMSData = input.imsData ?? {};

            const syncAdapter = Adapters.adapterByTag(imsType);
            const imsData = await syncAdapter.createIMSSystemData(apiIMSData);

            const ims = IMSSystem.create(context.dbManager, imsType, imsData);
            
            return base.createResult(args, context, { ims });
        }
    };
}
export default createIMS;