import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../ResolverContext";
import GraphQLTestMutationPayload from "../types/mutations/payloads/GraphQLTestMutationPayload";
import GraphQLTestMutationInput from "../types/mutations/inputs/GraphQLTestMutationInput";

let testMutation: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (testMutation === undefined) {
        testMutation = {
            type: GraphQLTestMutationPayload,
            description: "A mutation for testing if you're able to use GraphQL",
            args: {
                input: {
                    type: GraphQLTestMutationInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return testMutation;
};