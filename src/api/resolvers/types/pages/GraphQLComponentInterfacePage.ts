import { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLInt } from "graphql";
import GraphQLPage from "./GraphQLPage";
import GraphQLPageInfo from "./GraphQLPageInfo";
import GraphQLComponent from "../nodes/GraphQLComponent";
import GraphQLComponentEdge from "../edges/GraphQLComponentEdge";
import GraphQLComponentInterface from "../nodes/GraphQLComponentInterface";
import GraphQLComponentInterfaceEdge from "../edges/GraphQLComponentInterfaceEdge";

export default new GraphQLObjectType({
    name: "ComponentInterfacePage",
    description: "A page of multiple component interfaces",
    interfaces: [GraphQLPage],
    fields: {
        nodes: {
            type: GraphQLList(GraphQLComponentInterface),
            description: "All interfaces on this page"
        },
        edges: {
            type: GraphQLList(GraphQLComponentInterfaceEdge),
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
    }
});