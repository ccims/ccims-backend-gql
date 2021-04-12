import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { createPageConfig } from "./GraphQLPage";
import GraphQLIMSComponent from "../nodes/GraphQLIMSComponent";
import GraphQLIMSComponentEdge from "../edges/GraphQLIMSComponentEdge";
import { ResolverContext } from "../../../ResolverContext";

const IMSComponentPageConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createPageConfig(() => GraphQLIMSComponent, () => GraphQLIMSComponentEdge, "IMSComponent");
const GraphQLIMSComponentPage = new GraphQLObjectType(IMSComponentPageConfig);
export default GraphQLIMSComponentPage;