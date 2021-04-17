import { GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

const updateComponentInterfaceInputConfig: GraphQLInputObjectTypeConfig = {
    name: "UpdateComponentInterfaceInput",
    description: "The inputs for the updateComponentInterface mutation, updates only the provided fields",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        componentInterface: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the componentinterface to update"
        },
        name: {
            type: GraphQLString,
            description: "The name of the componentinterface\n\nMax. 256 characters"
        },
        description: {
            type: GraphQLString,
            description: "The description of the componentinterface\n\nMax. 65536 characters"
        }
    })
};
const GraphQLUpdateComponentInterfaceInput = new GraphQLInputObjectType(updateComponentInterfaceInputConfig);
export default GraphQLUpdateComponentInterfaceInput;