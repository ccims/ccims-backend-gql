import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { createPageConfig } from "./GraphQLPage";
import GraphQLArtifact from "../nodes/GraphQLArtifact";
import GraphQLArtifactEdge from "../edges/GraphQLArtifactEdge";
import { ResolverContext } from "../../../ResolverContext";

const artifactPageConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createPageConfig(() => GraphQLArtifact, () => GraphQLArtifactEdge, "Artifact");
const GraphQLArtifactPage = new GraphQLObjectType(artifactPageConfig);
export default GraphQLArtifactPage;