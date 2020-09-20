import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../ResolverContext";
import GraphQLCreateIMSPayload from "../types/mutations/payloads/GraphQLCreateIMSPayload";
import GraphQLCreateIMSInput from "../types/mutations/inputs/GraphQLCreateIMSInput";
import baseMutation from "./baseMutation";
import { ImsSystem, ImsType } from "../../../common/nodes/ImsSystem";
import PreconditionCheck from "../utils/PreconditionCheck";

function createIMS(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLCreateIMSPayload, GraphQLCreateIMSInput, "Creates a new issue management system input for use in one component");
    return {
        ...base,
        resolve: (src, args, context, info) => {
            const input = base.argsCheck(args);
            const imsType = PreconditionCheck.checkEnum<ImsType>(input, "imsType", ImsType);
            const endpoint = PreconditionCheck.checkString(input, "endpoint");
            const connectionData = PreconditionCheck.checkNonNull(input, "connectionData"); //TODO: Check that Connection data
            const ims = ImsSystem.create(context.dbManager, imsType, endpoint, connectionData);
            context.dbManager.save();
            return base.createResult(args, { ims });
        }
    };
}
export default createIMS;