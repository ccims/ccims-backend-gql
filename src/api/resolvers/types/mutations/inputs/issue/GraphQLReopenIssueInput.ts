import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

let reopenIssueInputConfig: GraphQLInputObjectTypeConfig = {
    name: "ReopenIssueInput",
    description: "The inputs for the reopenIssue",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        issue: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the issue to reopen"
        }
    })
};
let GraphQLReopenIssueInput = new GraphQLInputObjectType(reopenIssueInputConfig);
export default GraphQLReopenIssueInput;