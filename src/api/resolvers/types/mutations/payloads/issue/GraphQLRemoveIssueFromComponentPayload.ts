import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

let removeIssueFromComponentPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "RemoveIssueFromComponentPayload",
    description: "The Payload/Response for the removeIssueFromComponent mutation",
    fields: {
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    }
};
let GraphQLRemoveIssueFromComponentPayload = new GraphQLObjectType(removeIssueFromComponentPayloadConfig);
export default GraphQLRemoveIssueFromComponentPayload;