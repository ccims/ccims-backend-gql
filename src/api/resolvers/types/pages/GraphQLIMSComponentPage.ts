import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { createPageConfig } from "./GraphQLPage";
import GraphQLIMSComponent from "../nodes/GraphQLIMSComponent";
import GraphQLIMSComponentEdge from "../edges/GraphQLIMSComponentEdge";
import { ResolverContext } from "../../../ResolverContext";

const imsComponentPageConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createPageConfig(() => GraphQLIMSComponent, () => GraphQLIMSComponentEdge, "IMSComponent");
const GraphQLIMSComponentPage = new GraphQLObjectType(imsComponentPageConfig);
export default GraphQLIMSComponentPage;