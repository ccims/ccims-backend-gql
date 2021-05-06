import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import GraphQLIMS from "../nodes/GraphQLIMS";
import { ResolverContext } from "../../../ResolverContext";
import { createEdge } from "./createEdge";

const imsEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createEdge(() => GraphQLIMS, "IMS");
const GraphQLIMSEdge = new GraphQLObjectType(imsEdgeConfig);
export default GraphQLIMSEdge;