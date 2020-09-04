import { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLObjectTypeConfig } from "graphql";
import GraphQLPage from "./GraphQLPage";
import GraphQLPageInfo from "./GraphQLPageInfo";
import GraphQLComponent from "../nodes/GraphQLComponent";
import GraphQLComponentEdge from "../edges/GraphQLComponentEdge";
import { ResolverContext } from "../../../ResolverContext";

let componentPageConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "ComponentPage",
    description: "A page of multiple components",
    interfaces: [GraphQLPage],
    fields: () => ({
        nodes: {
            type: GraphQLList(GraphQLComponent),
            description: "All components on this page"
        },
        edges: {
            type: GraphQLList(GraphQLComponentEdge),
            description: "Edges to all nodes containing the cursor"
        },
        pageInfo: {
            type: GraphQLNonNull(GraphQLPageInfo),
            description: "Information about the current page (like length, first/last element)"
        },
        totalCount: {
            type: GraphQLNonNull(GraphQLInt),
            description: "The total number of elements matching the filter\n\n(Even ones that don't match the current page)"
        }
    })
};
let GraphQLComponentPage = new GraphQLObjectType(componentPageConfig);
export default GraphQLComponentPage;