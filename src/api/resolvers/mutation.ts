import { GraphQLObjectType, GraphQLString, GraphQLObjectTypeConfig, createSourceEventStream } from "graphql";
import testMutation from "./mutations/testMutation";
import { ResolverContext } from "../ResolverContext";
import issueMutations from "./issueMutations";
import createProject from "./mutations/createProject";
import createComponent from "./mutations/createComponent";
import createUser from "./mutations/createUser";
import createLabel from "./mutations/createLabel";

const mutationConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "Mutation",
    description: "Mutations to change the data within the ccims",
    fields: () => ({
        testMutation: testMutation(),
        ...issueMutations,
        createProject: createProject(),
        createComponent: createComponent(),
        createUser: createUser(),
        createLabel: createLabel()
    })
};
const mutation = new GraphQLObjectType(mutationConfig);
export default mutation;