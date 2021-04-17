import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

const deleteIssuePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "DeleteIssuePayload",
    description: "The Payload/Response for the deleteIssue mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    })
};
const GraphQLDeleteIssuePayload = new GraphQLObjectType(deleteIssuePayloadConfig);
export default GraphQLDeleteIssuePayload;