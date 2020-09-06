import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

let addIssueToLocationPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "AddIssueToLocationPayload",
    description: "The Payload/Response for the addIssueToLocation mutation",
    fields: {
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    }
};
let GraphQLAddIssueToLocationPayload = new GraphQLObjectType(addIssueToLocationPayloadConfig);
export default GraphQLAddIssueToLocationPayload;