import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import GraphQLProject from "../nodes/GraphQLProject";
import { ResolverContext } from "../../../ResolverContext";
import { createEdge } from "./createEdge";

const projectEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createEdge(() => GraphQLProject, "Project");
const GraphQLProjectEdge = new GraphQLObjectType(projectEdgeConfig);
export default GraphQLProjectEdge;