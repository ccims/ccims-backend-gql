import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import GraphQLComponent from "../nodes/GraphQLComponent";
import { ResolverContext } from "../../../ResolverContext";
import { createEdge } from "./createEdge";

const ComponentEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createEdge(() => GraphQLComponent, "Component");
const GraphQLComponentEdge = new GraphQLObjectType(ComponentEdgeConfig);
export default GraphQLComponentEdge;