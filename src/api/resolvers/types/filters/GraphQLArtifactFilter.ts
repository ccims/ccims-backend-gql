import { GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";
import { Artifact } from "../../../../common/nodes/Artifact";
import { syncNodeFilterFields } from "./syncNodeFilterFields";

const artifactFilterConfig: GraphQLInputObjectTypeConfig = {
    name: "ArtifactFilter",
    description: "Filters for Artifacts matching the given properties",
    fields: () => ({
        ...syncNodeFilterFields<Artifact>("Artifact"),
        uri: {
            type: GraphQLString,
            description: "The uri of the Artifact must match the given RegEx"
        }
    })
};
const GraphQLArtifactFilter = new GraphQLInputObjectType(artifactFilterConfig);
export default GraphQLArtifactFilter;