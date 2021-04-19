import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { createPageConfig } from "./GraphQLPage";
import GraphQLLabel from "../nodes/GraphQLLabel";
import GraphQLLabelEdge from "../edges/GraphQLLabelEdge";
import { ResolverContext } from "../../../ResolverContext";

const labelPageConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createPageConfig(() => GraphQLLabel, () => GraphQLLabelEdge, "Label");
const GraphQLLabelPage = new GraphQLObjectType(labelPageConfig);
export default GraphQLLabelPage;