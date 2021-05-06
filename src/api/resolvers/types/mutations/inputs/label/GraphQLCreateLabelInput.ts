import { GraphQLInputObjectTypeConfig, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID, GraphQLInputObjectType } from "graphql";
import GraphQLColor from "../../../../scalars/GraphQLColor";

const createLabelInputConfig: GraphQLInputObjectTypeConfig = {
    name: "CreateLabelInput",
    description: "The inputs for the createLabel mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        name: {
            type: GraphQLNonNull(GraphQLString),
            description: "The name of the label which to show in the GUI.\n\nMax. 256 characters."
        },
        description: {
            type: GraphQLString,
            description: "The description text for the label.\n\nMax. 65536 characters."
        },
        color: {
            type: GraphQLNonNull(GraphQLColor),
            description: "The color of the label\n\nMust be a valid Color string"
        },
        components: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLID))),
            description: "A list of components to which to add the label. At least one component is required\n\nThis must be a valid component ids"
        }
    })
};
const GraphQLCreateLabelInput = new GraphQLInputObjectType(createLabelInputConfig);
export default GraphQLCreateLabelInput;
