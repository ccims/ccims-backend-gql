import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import GraphQLReactionGroup from "../nodes/GraphQLReactionGroup";
import { ResolverContext } from "../../../ResolverContext";
import { createEdge } from "./createEdge";

const ReactionGroupEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createEdge(() => GraphQLReactionGroup, "ReactionGroup");
const GraphQLReactionGroupEdge = new GraphQLObjectType(ReactionGroupEdgeConfig);
export default GraphQLReactionGroupEdge;