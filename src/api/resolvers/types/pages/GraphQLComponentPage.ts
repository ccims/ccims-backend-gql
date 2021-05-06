import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { createPageConfig } from "./GraphQLPage";
import GraphQLComponent from "../nodes/GraphQLComponent";
import GraphQLComponentEdge from "../edges/GraphQLComponentEdge";
import { ResolverContext } from "../../../ResolverContext";

const componentPageConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createPageConfig(() => GraphQLComponent, () => GraphQLComponentEdge, "Component");
const GraphQLComponentPage = new GraphQLObjectType(componentPageConfig);
export default GraphQLComponentPage;