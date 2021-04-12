import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { createPageConfig } from "./GraphQLPage";
import GraphQLLabel from "../nodes/GraphQLLabel";
import GraphQLLabelEdge from "../edges/GraphQLLabelEdge";
import { ResolverContext } from "../../../ResolverContext";

const LabelPageConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createPageConfig(() => GraphQLLabel, () => GraphQLLabelEdge, "Label");
const GraphQLLabelPage = new GraphQLObjectType(LabelPageConfig);
export default GraphQLLabelPage;