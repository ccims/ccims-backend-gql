import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

let addIssueToComponentPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "AddIssueToComponentPayload",
    description: "The Payload/Response for the addIssueToComponent mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    })
};
let GraphQLAddIssueToComponentPayload = new GraphQLObjectType(addIssueToComponentPayloadConfig);
export default GraphQLAddIssueToComponentPayload;