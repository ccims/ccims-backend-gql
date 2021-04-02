import { GraphQLFieldConfig, GraphQLNonNull } from "graphql";
import { ResolverContext } from "../../ResolverContext";
import PreconditionCheck from "../../resolvers/utils/PreconditionCheck";
import GraphQLRegisterUserPayload from "../types/mutations/payloads/GraphQLRegisterUserPayload";
import GraphQLRegisterUserInput from "../types/mutations/inputs/GraphQLRegisterUserInput";
import { User } from "../../../common/nodes/User";
import { APIConfig } from "../../../config/APIConfig";
import { config } from "../../../config/Config";
import { CCIMSUser } from "../../../common/nodes/CCIMSUser";

function registerUser(): GraphQLFieldConfig<any, ResolverContext> {
    return {
        type: GraphQLRegisterUserPayload,
        description: "Registers/creates a new user in the ccims system",
        args: {
            input: {
                type: GraphQLNonNull(GraphQLRegisterUserInput),
                description: "The data for the mutation"
            }
        },
        resolve: async (src, args, context, info) => {
            if (!args || typeof args !== "object") {
                throw new Error("The arguments are mandatory for the mutation");
            }
            if (!args.input || typeof args.input !== "object") {
                throw new Error("The input for the mutation must be set");
            }
            const input = args.input;
            const username = PreconditionCheck.checkString(input, "username", 100);
            const displayName = PreconditionCheck.checkString(input, "displayName", 200);
            const password = PreconditionCheck.checkString(input, "password");
            const email = PreconditionCheck.checkNullableString(input, "email", 320);
            const user = await CCIMSUser.create(context.dbManager, username, displayName, password, email);
            if (config.api.createAllUsersAsGlobalAdmin) {
                user.permissions.globalPermissions = {
                    addRemoveComponents: true,
                    addRemoveProjects: true,
                    globalAdmin: true
                };
            }
            await context.dbManager.save();
            return { userId: user.id };
        }
    };
}
export default registerUser;