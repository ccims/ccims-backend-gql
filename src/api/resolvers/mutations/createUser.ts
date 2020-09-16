import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../ResolverContext";
import GraphQLCreateUserPayload from "../types/mutations/payloads/GraphQLCreateUserPayload";
import GraphQLCreateUserInput from "../types/mutations/inputs/GraphQLCreateUserInput";

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
            }
        };
    }
    return createUser;
};