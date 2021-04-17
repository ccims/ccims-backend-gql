import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import GraphQLComponentInterface from "../nodes/GraphQLComponentInterface";
import { ResolverContext } from "../../../ResolverContext";
import { createEdge } from "./createEdge";

const ComponentInterfaceEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createEdge(() => GraphQLComponentInterface, "ComponentInterface");
const GraphQLComponentInterfaceEdge = new GraphQLObjectType(ComponentInterfaceEdgeConfig);
export default GraphQLComponentInterfaceEdge;