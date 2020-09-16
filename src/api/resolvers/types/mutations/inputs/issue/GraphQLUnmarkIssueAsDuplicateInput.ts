import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

let unmarkIssueAsDuplicateInputConfig: GraphQLInputObjectTypeConfig = {
    name: "UnmarkIssueAsDuplicateInput",
    description: "The inputs for the unmarkIssueAsDuplicate",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        issue: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the issue which to unmark as duplicate"
        }
    })
};
let GraphQLUnmarkIssueAsDuplicateInput = new GraphQLInputObjectType(unmarkIssueAsDuplicateInputConfig);
export default GraphQLUnmarkIssueAsDuplicateInput;