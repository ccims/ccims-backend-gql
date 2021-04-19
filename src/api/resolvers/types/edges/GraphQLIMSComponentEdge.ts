import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import GraphQLIMSComponent from "../nodes/GraphQLIMSComponent";
import { ResolverContext } from "../../../ResolverContext";
import { createEdge } from "./createEdge";

const imsComponentEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createEdge(() => GraphQLIMSComponent, "IMSComponent");
const GraphQLIMSComponentEdge = new GraphQLObjectType(imsComponentEdgeConfig);
export default GraphQLIMSComponentEdge;