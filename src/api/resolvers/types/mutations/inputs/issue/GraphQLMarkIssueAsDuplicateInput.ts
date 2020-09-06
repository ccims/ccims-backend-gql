import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";

let markIssueAsDuplicateInputConfig: GraphQLInputObjectTypeConfig = {
    name: "MarkIssueAsDuplicateInput",
    description: "The inputs for the markIssueAsDuplicate",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        }
    })
};
let GraphQLMarkIssueAsDuplicateInput = new GraphQLInputObjectType(markIssueAsDuplicateInputConfig);
export default GraphQLMarkIssueAsDuplicateInput;