import { GraphQLInputObjectTypeConfig, GraphQLNonNull, GraphQLString, GraphQLID, GraphQLInputObjectType } from "graphql";

const addConsumedInterfaceInputConfig: GraphQLInputObjectTypeConfig = {
    name: "AddConsumedComponentInterfaceInput",
    description: "The inputs for the addConsumedInterface mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        component: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the component where to add the consumed interface"
        },
        componentInterface: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the componentInterface which is consumed by the component"
        }
    })
};
const GraphQLAddConsumedInterfaceInput = new GraphQLInputObjectType(addConsumedInterfaceInputConfig);
export default GraphQLAddConsumedInterfaceInput;
