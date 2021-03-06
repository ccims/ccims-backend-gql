import { GraphQLInputObjectTypeConfig, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID, GraphQLInputObjectType } from "graphql";

const removeComponentFromProjectInputConfig: GraphQLInputObjectTypeConfig = {
    name: "RemoveComponentFromProjectInput",
    description: "The inputs for the removeComponentFromProject mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        projectId: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the project from which to remove the component"
        },
        componentId: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the component to remove from the project"
        }
    })
};
const GraphQLRemoveComponentFromProjectInput = new GraphQLInputObjectType(removeComponentFromProjectInputConfig);
export default GraphQLRemoveComponentFromProjectInput;
