import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import { createEdge } from "./createEdge";
import GraphQLIMSUser from "../nodes/GraphQLIMSUser";

const imsUserEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createEdge(() => GraphQLIMSUser, "IMSUser");
const GraphQLUserEdge = new GraphQLObjectType(imsUserEdgeConfig);
export default GraphQLUserEdge;