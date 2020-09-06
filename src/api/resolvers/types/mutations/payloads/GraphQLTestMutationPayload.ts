import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../ResolverContext";

let testMutationPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "TestMutationPayload",
    description: "The Payload/Response for the addIssueToLocation mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    })
};
let GraphQLTestMutationPayload = new GraphQLObjectType(testMutationPayloadConfig);
export default GraphQLTestMutationPayload;