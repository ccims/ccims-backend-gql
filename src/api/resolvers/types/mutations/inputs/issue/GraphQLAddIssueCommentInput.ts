import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";

let addIssueCommentInputConfig: GraphQLInputObjectTypeConfig = {
    name: "AddIssueCommentInput",
    description: "The inputs for the addIssueComment",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        }
    })
};
let GraphQLAddIssueCommentInput = new GraphQLInputObjectType(addIssueCommentInputConfig);
export default GraphQLAddIssueCommentInput;