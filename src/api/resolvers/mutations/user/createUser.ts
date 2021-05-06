import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLCreateUserPayload from "../../types/mutations/payloads/user/GraphQLCreateUserPayload";
import GraphQLCreateUserInput from "../../types/mutations/inputs/user/GraphQLCreateUserInput";
import baseMutation from "../baseMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import { CCIMSUser } from "../../../../common/nodes/CCIMSUser";

function createUser(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLCreateUserPayload, GraphQLCreateUserInput, "Creates a new user in the system");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, perm => true);
            const username = PreconditionCheck.checkString(input, "username", 100);
            const displayName = PreconditionCheck.checkString(input, "displayName", 200);
            const password = PreconditionCheck.checkString(input, "password");
            const email = PreconditionCheck.checkNullableString(input, "email", 320);
            
            const user = await CCIMSUser.create(context.dbManager, username, displayName, password, email);
            return base.createResult(args, context, { user });
        }
    };
}
export default createUser;