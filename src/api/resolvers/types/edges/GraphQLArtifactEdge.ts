import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import GraphQLArtifact from "../nodes/GraphQLArtifact";
import { ResolverContext } from "../../../ResolverContext";
import { createEdge } from "./createEdge";

const artifactEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createEdge(() => GraphQLArtifact, "Artifact");
const GraphQLArtifactEdge = new GraphQLObjectType(artifactEdgeConfig);
export default GraphQLArtifactEdge;