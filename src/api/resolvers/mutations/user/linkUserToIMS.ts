import { GraphQLFieldConfig } from "graphql";
import { CCIMSUser } from "../../../../common/nodes/CCIMSUser";
import { IMSSystem } from "../../../../common/nodes/IMSSystem";
import { Adapters } from "../../../../sync/adapter/SyncAdapters";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLLinkUserToIMSInput from "../../types/mutations/inputs/user/GraphQLLinkUserToIMSInput";
import GraphQLLinkUserToIMSPayload from "../../types/mutations/payloads/user/GraphQLLinkUserToIMSPayload";
import PreconditionCheck from "../../utils/PreconditionCheck";
import baseMutation from "../baseMutation";

function linkUserToIMS(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLLinkUserToIMSPayload, GraphQLLinkUserToIMSInput, "Links a user to an IMS, updating an existing IMSUser or creating a new one");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, perm => true);
            //TODO: permissions
            const userId = PreconditionCheck.checkString(input, "user", 32);
            const imsId = PreconditionCheck.checkString(input, "ims", 32);
            const apiIMSData = input.imsData ?? {};

            const user = await context.dbManager.getNode(userId);
            if (!user || !(user instanceof CCIMSUser)) {
                throw new Error("The user id must be a valid CCIMSUser id");
            }
            const ims = await context.dbManager.getNode(imsId);
            if (!ims ||!(ims instanceof IMSSystem)) {
                throw new Error("The ims id must be a valid IMS id");
            }
            
            const syncAdapter = Adapters.adapterByTag(ims.type);
            const imsUser = await syncAdapter.linkUserToIMS(user, ims, apiIMSData);
            
            return base.createResult(args, { imsUser });
        }
    }
}
export default linkUserToIMS;