import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../ResolverContext";
import GraphQLCreateUserPayload from "../types/mutations/payloads/GraphQLCreateUserPayload";
import GraphQLCreateUserInput from "../types/mutations/inputs/GraphQLCreateUserInput";
import { User } from "../../../common/nodes/User";

let createUser: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (createUser === undefined) {
        createUser = {
            type: GraphQLCreateUserPayload,
            description: "Creates a new User",
            args: {
                input: {
                    type: GraphQLCreateUserInput,
                    description: "The data for the mutation"
                }
            },
            resolve: (src, args, context, info) => {
                const user = User.create(context.dbManager, args.input.username, args.input.displayName, args.input.password, args.input.email, args.input.projects);
                return { clientMutationID: args.input.clientMutationID, user: user };
            }
        };
    }
    return createUser;
};