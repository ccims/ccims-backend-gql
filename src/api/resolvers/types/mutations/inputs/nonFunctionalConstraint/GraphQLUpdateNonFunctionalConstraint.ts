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
        labelId: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the label to update"
        },
        content: {
            type: GraphQLString,
            description: "The name of the NonFunctionalConstraint which to show in the GUI.\n\nMax. 256 characters."
        },
        description: {
            type: GraphQLString,
            description: "The description text for the NonFunctionalConstraint.\n\nMax. 65536 characters."
        },
    })
};
const GraphQLUpdateLabelInput = new GraphQLInputObjectType(updateLabelInputConfig);
export default GraphQLUpdateLabelInput;