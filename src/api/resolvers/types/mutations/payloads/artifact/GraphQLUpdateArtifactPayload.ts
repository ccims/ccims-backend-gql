import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLArtifact from "../../../nodes/GraphQLArtifact";

const updateArtifactPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "UpdateArtifactPayload",
    description: "The Payload/Response for the updateArtifact mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        Artifact: {
            type: GraphQLArtifact,
            description: "The Artifact updated by this mutation"
        }
    })
};
const GraphQLUpdateArtifactPayload = new GraphQLObjectType(updateArtifactPayloadConfig);
export default GraphQLUpdateArtifactPayload;