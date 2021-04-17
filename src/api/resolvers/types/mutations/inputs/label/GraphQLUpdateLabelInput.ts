import { GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";
import GraphQLColor from "../../../../scalars/GraphQLColor";

const updateLabelInputConfig: GraphQLInputObjectTypeConfig = {
    name: "UpdateLabelInput",
    description: "The inputs for the updateLabel mutation, updates only the provided fields",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        label: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the label to update"
        },
        name: {
            type: GraphQLString,
            description: "The name of the label which to show in the GUI.\n\nMax. 256 characters."
        },
        description: {
            type: GraphQLString,
            description: "The description text for the label.\n\nMax. 65536 characters."
        },
        color: {
            type: GraphQLColor,
            description: "The color of the label\n\nMust be a valid Color string"
        }
    })
};
const GraphQLUpdateLabelInput = new GraphQLInputObjectType(updateLabelInputConfig);
export default GraphQLUpdateLabelInput;