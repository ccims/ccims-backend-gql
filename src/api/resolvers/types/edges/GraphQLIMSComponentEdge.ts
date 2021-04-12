import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import GraphQLIMSComponent from "../nodes/GraphQLIMSComponent";
import { ResolverContext } from "../../../ResolverContext";
import { createEdge } from "./createEdge";

const IMSComponentEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createEdge(() => GraphQLIMSComponent, "IMSComponent");
const GraphQLIMSComponentEdge = new GraphQLObjectType(IMSComponentEdgeConfig);
export default GraphQLIMSComponentEdge;