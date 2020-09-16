import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

let closeIssueInputConfig: GraphQLInputObjectTypeConfig = {
    name: "CloseIssueInput",
    description: "The inputs for the closeIssue",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        issue: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the issue to be closed"
        }
    })
};
let GraphQLCloseIssueInput = new GraphQLInputObjectType(closeIssueInputConfig);
export default GraphQLCloseIssueInput;