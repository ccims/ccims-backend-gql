import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import testMutation from "./mutations/testMutation";
import { ResolverContext } from "../ResolverContext";
import issueMutations from "./issueMutations";
import createProject from "./mutations/project/createProject";
import createComponent from "./mutations/component/createComponent";
import createUser from "./mutations/user/createUser";
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
import deleteComponent from "./mutations/component/deleteComponent";
import updateComponent from "./mutations/component/updateComponent";
import linkUserToIMS from "./mutations/user/linkUserToIMS";
import createIMS from "./mutations/ims/createIMS";
import createIMSComponent from "./mutations/ims/createIMSComponent";

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
        deleteComponent: deleteComponent(),
        updateComponent: updateComponent(),
        addConsumedInterface: addConsumedInterface(),
        removeConsumedInterface: removeConsumedInterface(),
        createUser: createUser(),
        linkUserToIMS: linkUserToIMS(),
        registerUser: registerUser(),
        createLabel: createLabel(),
        createIMS: createIMS(),
        createIMSComponent: createIMSComponent()
    })
};
const mutation = new GraphQLObjectType(mutationConfig);
export default mutation;