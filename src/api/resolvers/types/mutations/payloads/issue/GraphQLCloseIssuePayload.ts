import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

let closeIssuePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "CloseIssuePayload",
    description: "The Payload/Response for the closeIssue mutation",
    fields: {
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    }
};
let GraphQLCloseIssuePayload = new GraphQLObjectType(closeIssuePayloadConfig);
export default GraphQLCloseIssuePayload;