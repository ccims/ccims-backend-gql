import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { createPageConfig } from "./GraphQLPage";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLIMSUser from "../nodes/GraphQLIMSUser";
import GraphQLIMSUserEdge from "../edges/GraphQLIMSUserEdge";

const imsUserPageConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createPageConfig(() => GraphQLIMSUser, () => GraphQLIMSUserEdge, "IMSUser");
const GraphQLUserPage = new GraphQLObjectType(imsUserPageConfig);
export default GraphQLUserPage;