import { GraphQLInputObjectTypeConfig, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID, GraphQLInputObjectType } from "graphql";

const removeConsumedInterfaceInputConfig: GraphQLInputObjectTypeConfig = {
    name: "RemoveConsumedInterfaceInput",
    description: "The inputs for the removeConsumedInterface mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        componentId: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the component where to remove the interface"
        },
        interfaceId: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the componentInterface which is consumed by the component"
        }
    })
};
const GraphQLRemoveConsumedInterfaceInput = new GraphQLInputObjectType(removeConsumedInterfaceInputConfig);
export default GraphQLRemoveConsumedInterfaceInput;
