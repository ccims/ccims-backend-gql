import { GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

const removeLabelFromComponentInputConfig: GraphQLInputObjectTypeConfig = {
    name: "RemoveLabelFromComponentInput",
    description: "The inputs for the removeLabelFromComponent mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        component: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the component from which to remove a label"
        },
        label: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the label to remove from the specified component"
        }
    })
};
const GraphQLRemoveLabelFromComponentInput = new GraphQLInputObjectType(removeLabelFromComponentInputConfig);
export default GraphQLRemoveLabelFromComponentInput;