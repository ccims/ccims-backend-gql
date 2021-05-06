import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { createPageConfig } from "./GraphQLPage";
import GraphQLReactionGroup from "../nodes/GraphQLReactionGroup";
import GraphQLReactionGroupEdge from "../edges/GraphQLReactionGroupEdge";
import { ResolverContext } from "../../../ResolverContext";

const reactionGroupPageConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createPageConfig(() => GraphQLReactionGroup, () => GraphQLReactionGroupEdge, "ReactionGroup");
const GraphQLReactionGroupPage = new GraphQLObjectType(reactionGroupPageConfig);
export default GraphQLReactionGroupPage;