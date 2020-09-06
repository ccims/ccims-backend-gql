import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

let removeIssueFromLocationPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "RemoveIssueFromLocationPayload",
    description: "The Payload/Response for the removeIssueFromLocation mutation",
    fields: {
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    }
};
let GraphQLRemoveIssueFromLocationPayload = new GraphQLObjectType(removeIssueFromLocationPayloadConfig);
export default GraphQLRemoveIssueFromLocationPayload;