import { GraphQLInputObjectTypeConfig, GraphQLNonNull, GraphQLString, GraphQLID, GraphQLInputObjectType } from "graphql";

const addComponentToProjectInputConfig: GraphQLInputObjectTypeConfig = {
    name: "AddComponentToProjectInput",
    description: "The inputs for the addComponentToProject mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        projectId: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the project to which to add the component"
        },
        componentId: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the component to add to the project"
        }
    })
};
const GraphQLAddComponentToProjectInput = new GraphQLInputObjectType(addComponentToProjectInputConfig);
export default GraphQLAddComponentToProjectInput;
