import { GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

const addLabelToComponentInputConfig: GraphQLInputObjectTypeConfig = {
    name: "AddLabelToComponentInput",
    description: "The inputs for the addLabelToComponent mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        component: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the component to which to add the label"
        },
        label: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the label to be added to the specified component"
        }
    })
};
const GraphQLAddLabelToComponentInput = new GraphQLInputObjectType(addLabelToComponentInputConfig);
export default GraphQLAddLabelToComponentInput;