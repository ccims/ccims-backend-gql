import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

let addLabelPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "AddLabelPayload",
    description: "The Payload/Response for the addLabel mutation",
    fields: {
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    }
};
let GraphQLAddLabelPayload = new GraphQLObjectType(addLabelPayloadConfig);
export default GraphQLAddLabelPayload;