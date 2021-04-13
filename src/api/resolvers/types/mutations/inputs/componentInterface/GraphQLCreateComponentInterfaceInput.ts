import { GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

const createComponentInterfaceInputConfig: GraphQLInputObjectTypeConfig = {
    name: "CreateComponentInterfaceInput",
    description: "The inputs for the createComponentInterface mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        name: {
            type: GraphQLNonNull(GraphQLString),
            description: "The name of the componentInterface\n\nMax. 256 characters"
        },
        description: {
            type: GraphQLString,
            description: "The description of the componentInterface\n\nMax. 65536 characters"
        },
        component: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the component on which the created interface should be"
        }
    })
};
const GraphQLCreateComponentInterfaceInput = new GraphQLInputObjectType(createComponentInterfaceInputConfig);
export default GraphQLCreateComponentInterfaceInput;