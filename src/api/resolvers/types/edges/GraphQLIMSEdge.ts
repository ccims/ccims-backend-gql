import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import GraphQLIMS from "../nodes/GraphQLIMS";
import { ResolverContext } from "../../../ResolverContext";
import { createEdge } from "./createEdge";

const IMSEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createEdge(() => GraphQLIMS, "IMS");
const GraphQLIMSEdge = new GraphQLObjectType(IMSEdgeConfig);
export default GraphQLIMSEdge;