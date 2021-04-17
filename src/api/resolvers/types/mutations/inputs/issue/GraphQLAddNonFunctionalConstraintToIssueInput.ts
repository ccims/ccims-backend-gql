import { GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

const addNonFunctionalConstraintToIssueInputConfig: GraphQLInputObjectTypeConfig = {
    name: "AddNonFunctionalConstraintToIssueInput",
    description: "The inputs for the addToIssueNonFunctionalConstraint",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        nonFunctionalConstraint: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the NonFunctionalConstraint to be added to the specified issue"
        }
    })
};
const GraphQLAddNonFunctionalConstraintToIssueInput = new GraphQLInputObjectType(addNonFunctionalConstraintToIssueInputConfig);
export default GraphQLAddNonFunctionalConstraintToIssueInput;