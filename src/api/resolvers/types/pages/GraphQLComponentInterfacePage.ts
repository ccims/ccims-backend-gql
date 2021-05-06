import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { createPageConfig } from "./GraphQLPage";
import GraphQLComponentInterface from "../nodes/GraphQLComponentInterface";
import GraphQLComponentInterfaceEdge from "../edges/GraphQLComponentInterfaceEdge";
import { ResolverContext } from "../../../ResolverContext";

const componentInterfacePageConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createPageConfig(() => GraphQLComponentInterface, () => GraphQLComponentInterfaceEdge, "ComponentInterface");
const GraphQLComponentInterfacePage = new GraphQLObjectType(componentInterfacePageConfig);
export default GraphQLComponentInterfacePage;