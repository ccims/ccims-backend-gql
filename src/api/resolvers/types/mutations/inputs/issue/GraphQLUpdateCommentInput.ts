import { GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

const updateCommentInputConfig: GraphQLInputObjectTypeConfig = {
    name: "UpdateCommentInput",
    description: "The inputs for the updateComment, updates only the provided fields",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        comment: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the comment to update"
        },
        body: {
            type: GraphQLNonNull(GraphQLString),
            description: "The body text of the comment to be updated.\n\nMax. 65536 characters."
        }
    })
};
const GraphQLUpdateCommentInput = new GraphQLInputObjectType(updateCommentInputConfig);
export default GraphQLUpdateCommentInput;