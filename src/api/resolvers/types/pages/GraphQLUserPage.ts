import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { createPageConfig } from "./GraphQLPage";
import GraphQLUser from "../nodes/GraphQLUser";
import GraphQLUserEdge from "../edges/GraphQLUserEdge";
import { ResolverContext } from "../../../ResolverContext";

const userPageConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createPageConfig(() => GraphQLUser, () => GraphQLUserEdge, "User");
const GraphQLUserPage = new GraphQLObjectType(userPageConfig);
export default GraphQLUserPage;