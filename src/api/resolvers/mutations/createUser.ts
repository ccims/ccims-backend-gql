import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../ResolverContext";
import GraphQLCreateUserPayload from "../types/mutations/payloads/GraphQLCreateUserPayload";
import GraphQLCreateUserInput from "../types/mutations/inputs/GraphQLCreateUserInput";
import { User } from "../../../common/nodes/User";
import baseMutation from "./baseMutation";
import PreconditionCheck from "../utils/PreconditionCheck";

function createUser(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLCreateUserPayload, GraphQLCreateUserInput, "Creates a new user in the system");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.argsCheck(args);
            const username = PreconditionCheck.checkString(input, "username", 100);
            const displayName = PreconditionCheck.checkString(input, "displayName", 200);
            const password = PreconditionCheck.checkString(input, "password");
            const email = PreconditionCheck.checkNullableString(input, "email", 320);
            const user = await User.create(context.dbManager, username, displayName, password, email);
            await context.dbManager.save();
            return base.createResult(args, { user });
        }
    };
}
export default createUser;