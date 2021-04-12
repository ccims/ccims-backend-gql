import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { createPageConfig } from "./GraphQLPage";
import GraphQLProject from "../nodes/GraphQLProject";
import GraphQLProjectEdge from "../edges/GraphQLProjectEdge";
import { ResolverContext } from "../../../ResolverContext";

const ProjectPageConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createPageConfig(() => GraphQLProject, () => GraphQLProjectEdge, "Project");
const GraphQLProjectPage = new GraphQLObjectType(ProjectPageConfig);
export default GraphQLProjectPage;