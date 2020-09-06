import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";

let unmarkIssueAsDuplicateInputConfig: GraphQLInputObjectTypeConfig = {
    name: "UnmarkIssueAsDuplicateInput",
    description: "The inputs for the unmarkIssueAsDuplicate",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        }
    })
};
let GraphQLUnmarkIssueAsDuplicateInput = new GraphQLInputObjectType(unmarkIssueAsDuplicateInputConfig);
export default GraphQLUnmarkIssueAsDuplicateInput;