import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import GraphQLProject from "../nodes/GraphQLProject";
import { ResolverContext } from "../../../ResolverContext";
import { createEdge } from "./createEdge";

const ProjectEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createEdge(() => GraphQLProject, "Project");
const GraphQLProjectEdge = new GraphQLObjectType(ProjectEdgeConfig);
export default GraphQLProjectEdge;