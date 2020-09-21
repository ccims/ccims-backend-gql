import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

const addIssueCommentInputConfig: GraphQLInputObjectTypeConfig = {
    name: "AddIssueCommentInput",
    description: "The inputs for the addIssueComment",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        issue: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the issue to which to add a new comment"
        },
        body: {
            type: GraphQLNonNull(GraphQLString),
            description: "The body text of the comment to be added.\n\nMax. 65536 characters."
        }
    })
};
const GraphQLAddIssueCommentInput = new GraphQLInputObjectType(addIssueCommentInputConfig);
export default GraphQLAddIssueCommentInput;