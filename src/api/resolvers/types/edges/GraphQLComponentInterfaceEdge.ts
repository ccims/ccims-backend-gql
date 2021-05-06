import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import GraphQLComponentInterface from "../nodes/GraphQLComponentInterface";
import { ResolverContext } from "../../../ResolverContext";
import { createEdge } from "./createEdge";

const componentInterfaceEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createEdge(() => GraphQLComponentInterface, "ComponentInterface");
const GraphQLComponentInterfaceEdge = new GraphQLObjectType(componentInterfaceEdgeConfig);
export default GraphQLComponentInterfaceEdge;