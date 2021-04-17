import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { createPageConfig } from "./GraphQLPage";
import GraphQLUser from "../nodes/GraphQLUser";
import GraphQLUserEdge from "../edges/GraphQLUserEdge";
import { ResolverContext } from "../../../ResolverContext";

const UserPageConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createPageConfig(() => GraphQLUser, () => GraphQLUserEdge, "User");
const GraphQLUserPage = new GraphQLObjectType(UserPageConfig);
export default GraphQLUserPage;