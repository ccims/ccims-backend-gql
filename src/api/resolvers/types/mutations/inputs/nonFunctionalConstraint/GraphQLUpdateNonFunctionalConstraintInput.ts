import { GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

const updateNonFunctionalConstraintInputConfig: GraphQLInputObjectTypeConfig = {
    name: "UpdateNonFunctionalConstraintInput",
    description: "The inputs for the updateNonFunctionalConstraint mutation, updates only the provided fields",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        nonFunctionalConstraint: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the NonFunctionalConstraint to update"
        },
        content: {
            type: GraphQLString,
            description: "The name of the NonFunctionalConstraint which to show in the GUI.\n\nMax. 256 characters."
        },
        description: {
            type: GraphQLString,
            description: "The description text for the NonFunctionalConstraint.\n\nMax. 65536 characters."
        }
    })
};
const GraphQLUpdateNonFunctionalConstraintInput = new GraphQLInputObjectType(updateNonFunctionalConstraintInputConfig);
export default GraphQLUpdateNonFunctionalConstraintInput;