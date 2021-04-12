import { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLObjectTypeConfig } from "graphql";
import GraphQLPage from "./GraphQLPage";
import GraphQLPageInfo from "./GraphQLPageInfo";
import GraphQLArtifact from "../nodes/GraphQLArtifact";
import GraphQLArtifactEdge from "../edges/GraphQLArtifactEdge";
import { ResolverContext } from "../../../ResolverContext";

const artifactPageConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "ArtifactPage",
    description: "A page of multiple artifacts",
    interfaces: () => ([GraphQLPage]),
    fields: () => ({
        nodes: {
            type: GraphQLList(GraphQLArtifact),
            description: "All artifacts on this page"
        },
        edges: {
            type: GraphQLList(GraphQLArtifactEdge),
            description: "Edges to all nodes containing the cursor"
        },
        pageInfo: {
            type: GraphQLNonNull(GraphQLPageInfo),
            description: "Information about the current page (like length, first/last element)"
        },
        totalCount: {
            type: GraphQLNonNull(GraphQLInt),
            description: "The total number of elements matching the filter\n\n(Even ones that don't match the current page)"
        }
    })
};
const GraphQLArtifactPage = new GraphQLObjectType(artifactPageConfig);
export default GraphQLArtifactPage;