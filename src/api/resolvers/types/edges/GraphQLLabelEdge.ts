import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import GraphQLLabel from "../nodes/GraphQLLabel";
import { ResolverContext } from "../../../ResolverContext";
import { createEdge } from "./createEdge";

const LabelEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createEdge(() => GraphQLLabel, "Label");
const GraphQLLabelEdge = new GraphQLObjectType(LabelEdgeConfig);
export default GraphQLLabelEdge;