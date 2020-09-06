import { GraphQLObjectType, GraphQLString, GraphQLObjectTypeConfig } from "graphql";
import testMutation from "./mutations/testMutation";
import { ResolverContext } from "../ResolverContext";
import issueMutations from "./issueMutations";

let mutationConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "Mutation",
    description: "Mutations to change the data within the ccims",
    fields: () => ({
        testMutation: testMutation(),
        ...issueMutations
    })
};
let mutation = new GraphQLObjectType(mutationConfig);
export default mutation;