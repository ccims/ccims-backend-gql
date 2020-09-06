import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";

let changeIssueStartDateInputConfig: GraphQLInputObjectTypeConfig = {
    name: "ChangeIssueStartDateInput",
    description: "The inputs for the changeIssueStartDate",
    fields: {
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        }
    }
};
let GraphQLChangeIssueStartDateInput = new GraphQLInputObjectType(changeIssueStartDateInputConfig);
export default GraphQLChangeIssueStartDateInput;