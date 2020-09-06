import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

let deleteIssueCommentPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "DeleteIssueCommentPayload",
    description: "The Payload/Response for the deleteIssueComment mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    })
};
let GraphQLDeleteIssueCommentPayload = new GraphQLObjectType(deleteIssueCommentPayloadConfig);
export default GraphQLDeleteIssueCommentPayload;