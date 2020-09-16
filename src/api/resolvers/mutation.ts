import { GraphQLObjectType, GraphQLString, GraphQLObjectTypeConfig } from "graphql";
import testMutation from "./mutations/testMutation";
import { ResolverContext } from "../ResolverContext";
import issueMutations from "./issueMutations";
import createProject from "./mutations/createProject";
import createComponent from "./mutations/createComponent";

let mutationConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "Mutation",
    description: "Mutations to change the data within the ccims",
    fields: () => ({
        testMutation: testMutation(),
        ...issueMutations,
        createProject: createProject(),
        createComponent: createComponent(),
    })
};
let mutation = new GraphQLObjectType(mutationConfig);
export default mutation;