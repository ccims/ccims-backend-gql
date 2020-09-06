import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";

let deleteIssueCommentInputConfig: GraphQLInputObjectTypeConfig = {
    name: "DeleteIssueCommentInput",
    description: "The inputs for the deleteIssueComment",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        }
    })
};
let GraphQLDeleteIssueCommentInput = new GraphQLInputObjectType(deleteIssueCommentInputConfig);
export default GraphQLDeleteIssueCommentInput;