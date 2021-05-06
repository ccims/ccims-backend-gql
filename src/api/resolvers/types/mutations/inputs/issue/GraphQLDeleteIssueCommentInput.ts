import { GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

const deleteIssueCommentInputConfig: GraphQLInputObjectTypeConfig = {
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
const GraphQLDeleteIssueCommentInput = new GraphQLInputObjectType(deleteIssueCommentInputConfig);
export default GraphQLDeleteIssueCommentInput;