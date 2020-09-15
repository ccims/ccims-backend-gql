import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLComment from "../../../nodes/GraphQLComment";
import GraphQLReactionGroup from "../../../nodes/GraphQLReactionGroup";
import GraphQLReactionGroupEdge from "../../../edges/GraphQLReactionGroupEdge";

let addReactionToCommentPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "AddReactionToCommentPayload",
    description: "The Payload/Response for the addToCommentReaction mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        comment: {
            type: GraphQLComment,
            description: "The comment the reaction was added to"
        },
        reaction: {
            type: GraphQLReactionGroup,
            description: "The group of users that all reacted to this comment with the same reaction"
        }
    })
};
let GraphQLAddReactionToCommentPayload = new GraphQLObjectType(addReactionToCommentPayloadConfig);
export default GraphQLAddReactionToCommentPayload;