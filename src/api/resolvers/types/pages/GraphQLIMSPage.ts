import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { createPageConfig } from "./GraphQLPage";
import GraphQLIMS from "../nodes/GraphQLIMS";
import GraphQLIMSEdge from "../edges/GraphQLIMSEdge";
import { ResolverContext } from "../../../ResolverContext";

const imsPageConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createPageConfig(() => GraphQLIMS, () => GraphQLIMSEdge, "IMS");
const GraphQLIMSPage = new GraphQLObjectType(imsPageConfig);
export default GraphQLIMSPage;