import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

let deleteIssueCommentInputConfig: GraphQLInputObjectTypeConfig = {
    name: "DeleteIssueCommentInput",
    description: "The inputs for the deleteIssueComment",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        issueComment: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the issue comment to be deleted"
        }
    })
};
let GraphQLDeleteIssueCommentInput = new GraphQLInputObjectType(deleteIssueCommentInputConfig);
export default GraphQLDeleteIssueCommentInput;