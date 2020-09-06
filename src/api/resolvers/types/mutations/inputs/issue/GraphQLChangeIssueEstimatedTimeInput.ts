import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";

let changeIssueEstimatedTimeInputConfig: GraphQLInputObjectTypeConfig = {
    name: "ChangeIssueEstimatedTimeInput",
    description: "The inputs for the changeIssueEstimatedTime",
    fields: {
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        }
    }
};
let GraphQLChangeIssueEstimatedTimeInput = new GraphQLInputObjectType(changeIssueEstimatedTimeInputConfig);
export default GraphQLChangeIssueEstimatedTimeInput;