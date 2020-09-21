import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

const markIssueAsDuplicateInputConfig: GraphQLInputObjectTypeConfig = {
    name: "MarkIssueAsDuplicateInput",
    description: "The inputs for the markIssueAsDuplicate",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        issue: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the issue to be marked as duplicate (the duplicate)"
        },
        originalIssue: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the issue the above one is a duplicate of (the original)"
        }
    })
};
const GraphQLMarkIssueAsDuplicateInput = new GraphQLInputObjectType(markIssueAsDuplicateInputConfig);
export default GraphQLMarkIssueAsDuplicateInput;