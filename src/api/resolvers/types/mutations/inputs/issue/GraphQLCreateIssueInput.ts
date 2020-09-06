import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";

let createIssueInputConfig: GraphQLInputObjectTypeConfig = {
    name: "CreateIssueInput",
    description: "The inputs for the createIssue",
    fields: {
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        }
    }
};
let GraphQLCreateIssueInput = new GraphQLInputObjectType(createIssueInputConfig);
export default GraphQLCreateIssueInput;