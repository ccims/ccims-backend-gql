import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { ResolverContext } from "../ResolverContext";
import issueMutations from "./issueMutations";
import createProject from "./mutations/project/createProject";
import createComponent from "./mutations/component/createComponent";
import createUser from "./mutations/user/createUser";
import createLabel from "./mutations/label/createLabel";
import deleteProject from "./mutations/project/deleteProject"
import updateProject from "./mutations/project/updateProject";
import addComponentToProject from "./mutations/project/addComponentToProject";
import removeComponentFromProject from "./mutations/project/removeComponentFromProject";
import registerUser from "../publicResolvers/mutations/registerUser";
import createComponentInterface from "./mutations/componentInterface/createComponentInterface";
import deleteComponentInterface from "./mutations/componentInterface/deleteComponentInterface";
import updateComponentInterface from "./mutations/componentInterface/updateComponentInterface";
import addConsumedInterface from "./mutations/component/addConsumedComponentInterface";
import removeConsumedInterface from "./mutations/component/removeConsumedComponentInterface";
import deleteComponent from "./mutations/component/deleteComponent";
import updateComponent from "./mutations/component/updateComponent";
import linkUserToIMS from "./mutations/user/linkUserToIMS";
import createIMS from "./mutations/ims/createIMS";
import createIMSComponent from "./mutations/ims/createIMSComponent";
import deleteLabel from "./mutations/label/deleteLabel";
import updateLabel from "./mutations/label/updateLabel";
import addLabelToComponent from "./mutations/label/addLabelToComponent";
import removeLabelFromComponent from "./mutations/label/removeLabelFromComponent";
import createArtifact from "./mutations/artifact/createArtifact";
import deleteArtifact from "./mutations/artifact/deleteArtifact";
import updateArtifact from "./mutations/artifact/updateArtifact";
import createNonFunctionalConstraint from "./mutations/nonFunctionalConstraint/createNonFunctionalConstraint";
import deleteNonFunctionalConstraint from "./mutations/nonFunctionalConstraint/deleteNonFunctionalConstraint";
import updateNonFunctionalConstraint from "./mutations/nonFunctionalConstraint/updateNonFunctionalConstraint";

const mutationConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "Mutation",
    description: "Mutations to change the data within the ccims",
    fields: () => ({
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
        deleteLabel: deleteLabel(),
        updateLabel: updateLabel(),
        addLabelToComponent: addLabelToComponent(),
        removeLabelFromComponent: removeLabelFromComponent(),
        createIMS: createIMS(),
        createIMSComponent: createIMSComponent(),
        createArtifact: createArtifact(),
        deleteArtifact: deleteArtifact(),
        updateArtifact: updateArtifact(),
        createNonFunctionalConstraint: createNonFunctionalConstraint(),
        deleteNonFunctionalConstraint: deleteNonFunctionalConstraint(),
        updateNonFunctionalConstraint: updateNonFunctionalConstraint()
    })
};
const mutation = new GraphQLObjectType(mutationConfig);
export default mutation;