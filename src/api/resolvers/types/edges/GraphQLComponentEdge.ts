import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import GraphQLComponent from "../nodes/GraphQLComponent";
import { ResolverContext } from "../../../ResolverContext";
import { createEdge } from "./createEdge";

const componentEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createEdge(() => GraphQLComponent, "Component");
const GraphQLComponentEdge = new GraphQLObjectType(componentEdgeConfig);
export default GraphQLComponentEdge;