import { GraphQLInputObjectTypeConfig, GraphQLNonNull, GraphQLString, GraphQLID, GraphQLInputObjectType } from "graphql";

const deleteNonFunctionalConstraintInputConfig: GraphQLInputObjectTypeConfig = {
    name: "DeleteNonFunctionalConstraintInput",
    description: "The inputs for the deleteNonFunctionalConstraint mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        nonFunctionalConstraintId: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the NonFunctionalConstraint to delete"
        }
    })
};
const GraphQLDeleteNonFunctionalConstraintInput = new GraphQLInputObjectType(deleteNonFunctionalConstraintInputConfig);
export default GraphQLDeleteNonFunctionalConstraintInput;
