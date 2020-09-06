import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

let unpinIssuePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "UnpinIssuePayload",
    description: "The Payload/Response for the unpinIssue mutation",
    fields: {
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    }
};
let GraphQLUnpinIssuePayload = new GraphQLObjectType(unpinIssuePayloadConfig);
export default GraphQLUnpinIssuePayload;