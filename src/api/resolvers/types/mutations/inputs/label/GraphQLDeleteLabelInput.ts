import { GraphQLInputObjectTypeConfig, GraphQLNonNull, GraphQLString, GraphQLID, GraphQLInputObjectType } from "graphql";

const deleteLabelInputConfig: GraphQLInputObjectTypeConfig = {
    name: "DeleteLabelInput",
    description: "The inputs for the deleteLabel mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        label: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the label to delete"
        }
    })
};
const GraphQLDeleteLabelInput = new GraphQLInputObjectType(deleteLabelInputConfig);
export default GraphQLDeleteLabelInput;
