import { GraphQLInputObjectTypeConfig, GraphQLNonNull, GraphQLString, GraphQLID, GraphQLInputObjectType } from "graphql";

const deleteArtifactInputConfig: GraphQLInputObjectTypeConfig = {
    name: "DeleteArtifactInput",
    description: "The inputs for the deleteArtifact mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        artifactId: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the Artifact to delete"
        }
    })
};
const GraphQLDeleteArtifactInput = new GraphQLInputObjectType(deleteArtifactInputConfig);
export default GraphQLDeleteArtifactInput;
