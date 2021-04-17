import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import GraphQLUser from "../nodes/GraphQLUser";
import { ResolverContext } from "../../../ResolverContext";
import { createEdge } from "./createEdge";

const UserEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createEdge(() => GraphQLUser, "User");
const GraphQLUserEdge = new GraphQLObjectType(UserEdgeConfig);
export default GraphQLUserEdge;