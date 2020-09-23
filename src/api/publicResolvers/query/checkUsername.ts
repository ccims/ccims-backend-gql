import { ResolverContext } from "../../ResolverContext";
import { GraphQLFieldConfig, GraphQLBoolean, GraphQLString, GraphQLNonNull } from "graphql";
import PreconditionCheck from "../../resolvers/utils/PreconditionCheck";
import { LoadUsersCommand } from "../../../common/database/commands/load/nodes/LoadUsersCommand";
import { User } from "../../../common/nodes/User";

function checkUsername(): GraphQLFieldConfig<any, ResolverContext> {
    return {
        type: GraphQLBoolean,
        description: "Checks wether the given username is still available or already taken.\n\n`true` is returned if the username is available and __NOT__ take\n`false, if it __IS__ already taken and can't be used for a new user",
        args: {
            username: {
                type: GraphQLNonNull(GraphQLString),
                description: "The username to be checked for availability"
            }
        },
        resolve: async (src, args, context, info) => {
            if (!args || typeof args !== "object") {
                throw new Error("The arguments are mandatory for checking the username");
            }
            const username = PreconditionCheck.checkString(args, "username", 100);
            return User.usernameAvailable(context.dbManager, username);
        }
    }
}
export default checkUsername;