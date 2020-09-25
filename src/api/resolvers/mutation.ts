import { GraphQLObjectType, GraphQLString, GraphQLObjectTypeConfig, createSourceEventStream } from "graphql";
import testMutation from "./mutations/testMutation";
import { ResolverContext } from "../ResolverContext";
import issueMutations from "./issueMutations";
import createProject from "./mutations/project/createProject";
import createComponent from "./mutations/createComponent";
import createUser from "./mutations/createUser";
import createLabel from "./mutations/createLabel";
import deleteProject from "./mutations/project/deleteProject"
import updateProject from "./mutations/project/updateProject";
import addComponentToProject from "./mutations/project/addComponentToProject";
import removeComponentFromProject from "./mutations/project/removeComponentFromProject";
import registerUser from "../publicResolvers/mutations/registerUser";

const mutationConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "Mutation",
    description: "Mutations to change the data within the ccims",
    fields: () => ({
        testMutation: testMutation(),
        ...issueMutations,
        createProject: createProject(),
        deleteProject: deleteProject(),
        updateProject: updateProject(),
        addComponentToProject: addComponentToProject(),
        removeComponentFromProject: removeComponentFromProject(),
        createComponent: createComponent(),
        createUser: createUser(),
        registerUser: registerUser(),
        createLabel: createLabel()
    })
};
const mutation = new GraphQLObjectType(mutationConfig);
export default mutation;