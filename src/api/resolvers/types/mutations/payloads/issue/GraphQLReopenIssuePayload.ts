import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

let reopenIssuePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "ReopenIssuePayload",
    description: "The Payload/Response for the reopenIssue mutation",
    fields: {
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    }
};
let GraphQLReopenIssuePayload = new GraphQLObjectType(reopenIssuePayloadConfig);
export default GraphQLReopenIssuePayload;