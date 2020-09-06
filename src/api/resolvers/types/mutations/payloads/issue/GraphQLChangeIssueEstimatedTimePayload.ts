import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

let changeIssueEstimatedTimePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "ChangeIssueEstimatedTimePayload",
    description: "The Payload/Response for the changeIssueEstimatedTime mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    })
};
let GraphQLChangeIssueEstimatedTimePayload = new GraphQLObjectType(changeIssueEstimatedTimePayloadConfig);
export default GraphQLChangeIssueEstimatedTimePayload;