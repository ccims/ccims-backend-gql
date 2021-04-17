import { GraphQLInputObjectTypeConfig, GraphQLNonNull, GraphQLString, GraphQLID, GraphQLInputObjectType } from "graphql";

const createNonFunctionalConstraintInputConfig: GraphQLInputObjectTypeConfig = {
    name: "CreateNonFunctionalConstraintInput",
    description: "The inputs for the createNonFunctionalConstraint mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        content: {
            type: GraphQLNonNull(GraphQLString),
            description: "The name of the NonFunctionalConstraint which to show in the GUI.\n\nMax. 256 characters."
        },
        description: {
            type: GraphQLString,
            description: "The description text for the NonFunctionalConstraint.\n\nMax. 65536 characters."
        },
        issue: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the issue where the NonFunctionalConstraint is created on."
        }
    })
};
const GraphQLCreateNonFunctionalConstraintInput = new GraphQLInputObjectType(createNonFunctionalConstraintInputConfig);
export default GraphQLCreateNonFunctionalConstraintInput;
