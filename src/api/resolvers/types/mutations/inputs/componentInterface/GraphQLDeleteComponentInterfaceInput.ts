import { GraphQLInputObjectTypeConfig, GraphQLNonNull, GraphQLString, GraphQLID, GraphQLInputObjectType } from "graphql";

const deleteComponentInterfaceInputConfig: GraphQLInputObjectTypeConfig = {
    name: "DeleteComponentInterfaceInput",
    description: "The inputs for the deleteComponentInterface mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        componentInterface: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the componentInterface to delete"
        }
    })
};
const GraphQLDeleteComponentInterfaceInput = new GraphQLInputObjectType(deleteComponentInterfaceInputConfig);
export default GraphQLDeleteComponentInterfaceInput;
