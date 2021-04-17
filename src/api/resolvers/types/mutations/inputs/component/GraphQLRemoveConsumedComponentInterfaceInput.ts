import { GraphQLInputObjectTypeConfig, GraphQLNonNull, GraphQLString, GraphQLID, GraphQLInputObjectType } from "graphql";

const removeConsumedInterfaceInputConfig: GraphQLInputObjectTypeConfig = {
    name: "RemoveConsumedComponentInterfaceInput",
    description: "The inputs for the removeConsumedInterface mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        component: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the component where to remove the interface"
        },
        componentInterface: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the componentInterface which is consumed by the component"
        }
    })
};
const GraphQLRemoveConsumedInterfaceInput = new GraphQLInputObjectType(removeConsumedInterfaceInputConfig);
export default GraphQLRemoveConsumedInterfaceInput;
