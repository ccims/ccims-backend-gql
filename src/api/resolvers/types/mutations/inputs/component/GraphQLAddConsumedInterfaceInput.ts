import { GraphQLInputObjectTypeConfig, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID, GraphQLInputObjectType } from "graphql";

const addConsumedInterfaceInputConfig: GraphQLInputObjectTypeConfig = {
    name: "AddConsumedInterfaceInput",
    description: "The inputs for the addConsumedInterface mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        componentId: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the component where to add the consumed interface"
        },
        interfaceId: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the componentInterface which is consumed by the component"
        }
    })
};
const GraphQLAddConsumedInterfaceInput = new GraphQLInputObjectType(addConsumedInterfaceInputConfig);
export default GraphQLAddConsumedInterfaceInput;
