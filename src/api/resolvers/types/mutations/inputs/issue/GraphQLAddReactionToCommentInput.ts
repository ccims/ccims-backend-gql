import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

const addReactionToCommentInputConfig: GraphQLInputObjectTypeConfig = {
    name: "AddReactionToCommentInput",
    description: "The inputs for the addToCommentReaction",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        comment: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the comment to which to add the specified reaction by the current user"
        },
        reaction: {
            type: GraphQLNonNull(GraphQLString),
            description: "The name of the reaction to be added to the specified comment by the current user"
        }
    })
};
const GraphQLAddReactionToCommentInput = new GraphQLInputObjectType(addReactionToCommentInputConfig);
export default GraphQLAddReactionToCommentInput;