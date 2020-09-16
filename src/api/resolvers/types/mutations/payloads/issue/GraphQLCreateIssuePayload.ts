import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLIssue from "../../../nodes/GraphQLIssue";

let createIssuePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "CreateIssuePayload",
    description: "The Payload/Response for the createIssue mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        issue: {
            type: GraphQLIssue,
            description: "The created issue node"
        }
    })
};
let GraphQLCreateIssuePayload = new GraphQLObjectType(createIssuePayloadConfig);
export default GraphQLCreateIssuePayload;