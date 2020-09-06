import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

let pinIssuePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "PinIssuePayload",
    description: "The Payload/Response for the pinIssue mutation",
    fields: {
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    }
};
let GraphQLPinIssuePayload = new GraphQLObjectType(pinIssuePayloadConfig);
export default GraphQLPinIssuePayload;