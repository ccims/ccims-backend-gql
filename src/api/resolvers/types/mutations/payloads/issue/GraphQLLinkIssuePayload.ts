import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

let linkIssuePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "LinkIssuePayload",
    description: "The Payload/Response for the linkIssue mutation",
    fields: {
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    }
};
let GraphQLLinkIssuePayload = new GraphQLObjectType(linkIssuePayloadConfig);
export default GraphQLLinkIssuePayload;