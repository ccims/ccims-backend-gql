import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

const deleteArtifactPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "DeleteArtifactPayload",
    description: "The Payload/Response for the deleteArtifact mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    })
};
const GraphQLDeleteArtifactPayload = new GraphQLObjectType(deleteArtifactPayloadConfig);
export default GraphQLDeleteArtifactPayload;