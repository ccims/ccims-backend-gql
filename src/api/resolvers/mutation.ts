import { GraphQLObjectType, GraphQLString, GraphQLObjectTypeConfig, createSourceEventStream } from "graphql";
import testMutation from "./mutations/testMutation";
import { ResolverContext } from "../ResolverContext";
import issueMutations from "./issueMutations";
import createProject from "./mutations/project/createProject";
import createComponent from "./mutations/component/createComponent";
import createUser from "./mutations/createUser";
import createLabel from "./mutations/createLabel";
import deleteProject from "./mutations/project/deleteProject"
import updateProject from "./mutations/project/updateProject";
import addComponentToProject from "./mutations/project/addComponentToProject";
import removeComponentFromProject from "./mutations/project/removeComponentFromProject";
import registerUser from "../publicResolvers/mutations/registerUser";
import createComponentInterface from "./mutations/componentInterface/createComponentInterface";
import deleteComponentInterface from "./mutations/componentInterface/deleteComponentInterface";
import updateComponentInterface from "./mutations/componentInterface/updateComponentInterface";
import addConsumedInterface from "./mutations/component/addConsumedInterface";
import removeConsumedInterface from "./mutations/component/removeConsumedInterface";

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
        createComponentInterface: createComponentInterface(),
        deleteComponentInterface: deleteComponentInterface(),
        updateComponentInterface: updateComponentInterface(),
        createComponent: createComponent(),
        addConsumedInterface: addConsumedInterface(),
        removeConsumedInterface: removeConsumedInterface(),
        createUser: createUser(),
        registerUser: registerUser(),
        createLabel: createLabel()
    })
};
const mutation = new GraphQLObjectType(mutationConfig);
export default mutation;