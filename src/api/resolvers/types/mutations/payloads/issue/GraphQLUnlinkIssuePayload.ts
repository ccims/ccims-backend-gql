import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

let unlinkIssuePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "UnlinkIssuePayload",
    description: "The Payload/Response for the unlinkIssue mutation",
    fields: {
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    }
};
let GraphQLUnlinkIssuePayload = new GraphQLObjectType(unlinkIssuePayloadConfig);
export default GraphQLUnlinkIssuePayload;