import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLObjectTypeConfig } from "graphql";
import GraphQLArtifact from "../nodes/GraphQLArtifact";
import { ResolverContext } from "../../../ResolverContext";

const artifactEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "ArtifactEdge",
    description: "An edge for a ArtifactPage to link a cursor to an element",
    fields: () => ({
        node: {
            type: GraphQLArtifact,
            description: "The artifact linked to by this edge"
        },
        cursor: {
            type: GraphQLNonNull(GraphQLString),
            description: "The cursor for use in the pagination"
        }
    })
};
const GraphQLArtifactEdge = new GraphQLObjectType(artifactEdgeConfig);
export default GraphQLArtifactEdge;