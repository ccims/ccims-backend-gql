import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

let removeReactionPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "RemoveReactionPayload",
    description: "The Payload/Response for the removeReaction mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    })
};
let GraphQLRemoveReactionPayload = new GraphQLObjectType(removeReactionPayloadConfig);
export default GraphQLRemoveReactionPayload;