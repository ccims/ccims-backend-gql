import { GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLArtifact from "../../../nodes/GraphQLArtifact";

const createArtifactPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "CreateArtifactPayload",
    description: "The Payload/Response for the createArtifact mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        artifact: {
            type: GraphQLArtifact,
            description: "The Artifact created by this mutation"
        }
    })
};
const GraphQLCreateArtifactPayload = new GraphQLObjectType(createArtifactPayloadConfig);
export default GraphQLCreateArtifactPayload;