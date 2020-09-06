import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

let addReactionPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "AddReactionPayload",
    description: "The Payload/Response for the addReaction mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    })
};
let GraphQLAddReactionPayload = new GraphQLObjectType(addReactionPayloadConfig);
export default GraphQLAddReactionPayload;