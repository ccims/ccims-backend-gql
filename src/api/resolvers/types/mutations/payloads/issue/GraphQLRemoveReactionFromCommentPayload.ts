import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

let removeReactionFromCommentPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "RemoveReactionFromCommentPayload",
    description: "The Payload/Response for the removeFromCommentReaction mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    })
};
let GraphQLRemoveReactionFromCommentPayload = new GraphQLObjectType(removeReactionFromCommentPayloadConfig);
export default GraphQLRemoveReactionFromCommentPayload;