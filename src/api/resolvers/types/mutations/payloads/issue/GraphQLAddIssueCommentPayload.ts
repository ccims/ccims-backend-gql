import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

let addIssueCommentPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "AddIssueCommentPayload",
    description: "The Payload/Response for the addIssueComment mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    })
};
let GraphQLAddIssueCommentPayload = new GraphQLObjectType(addIssueCommentPayloadConfig);
export default GraphQLAddIssueCommentPayload;