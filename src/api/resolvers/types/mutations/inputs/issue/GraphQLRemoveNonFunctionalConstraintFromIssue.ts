import { GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

const removeNonFunctionalConstraintFromIssueInputConfig: GraphQLInputObjectTypeConfig = {
    name: "RemoveNonFunctionalConstraintFromIssueInput",
    description: "The inputs for the removeNonFunctionalConstraintFromIssue mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        issue: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the issue from which to remove a NonFunctionalConstraint"
        },
        nonFunctionalConstraint: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the NonFunctionalConstraint to remove from the specified issue"
        }
    })
};
const GraphQLRemoveNonFunctionalConstraintFromIssueInput = new GraphQLInputObjectType(removeNonFunctionalConstraintFromIssueInputConfig);
export default GraphQLRemoveNonFunctionalConstraintFromIssueInput;