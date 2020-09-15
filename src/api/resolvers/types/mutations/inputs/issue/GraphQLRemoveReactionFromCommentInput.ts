import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

let removeReactionFromCommentInputConfig: GraphQLInputObjectTypeConfig = {
    name: "RemoveReactionFromCommentInput",
    description: "The inputs for the removeFromCommentReaction",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        comment: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the comment from which to remove the specified reaction by the current user"
        },
        reactionToRemove: {
            type: GraphQLNonNull(GraphQLString),
            description: "The name of the reaction to remove from the given comment"
        }
    })
};
let GraphQLRemoveReactionFromCommentInput = new GraphQLInputObjectType(removeReactionFromCommentInputConfig);
export default GraphQLRemoveReactionFromCommentInput;