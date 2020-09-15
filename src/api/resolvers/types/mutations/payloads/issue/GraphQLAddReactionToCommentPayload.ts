import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

let addReactionToCommentPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "AddReactionToCommentPayload",
    description: "The Payload/Response for the addToCommentReaction mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    })
};
let GraphQLAddReactionToCommentPayload = new GraphQLObjectType(addReactionToCommentPayloadConfig);
export default GraphQLAddReactionToCommentPayload;