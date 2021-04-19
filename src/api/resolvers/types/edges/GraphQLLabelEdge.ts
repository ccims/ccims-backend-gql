import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import GraphQLLabel from "../nodes/GraphQLLabel";
import { ResolverContext } from "../../../ResolverContext";
import { createEdge } from "./createEdge";

const labelEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createEdge(() => GraphQLLabel, "Label");
const GraphQLLabelEdge = new GraphQLObjectType(labelEdgeConfig);
export default GraphQLLabelEdge;