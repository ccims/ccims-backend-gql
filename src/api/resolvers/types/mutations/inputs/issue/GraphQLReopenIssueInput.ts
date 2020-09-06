import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";

let reopenIssueInputConfig: GraphQLInputObjectTypeConfig = {
    name: "ReopenIssueInput",
    description: "The inputs for the reopenIssue",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        }
    })
};
let GraphQLReopenIssueInput = new GraphQLInputObjectType(reopenIssueInputConfig);
export default GraphQLReopenIssueInput;