import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

let removeLabelPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "RemoveLabelPayload",
    description: "The Payload/Response for the removeLabel mutation",
    fields: {
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    }
};
let GraphQLRemoveLabelPayload = new GraphQLObjectType(removeLabelPayloadConfig);
export default GraphQLRemoveLabelPayload;