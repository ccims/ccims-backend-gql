import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLInt, GraphQLList } from "graphql";
import GraphQLNode from "../GraphQLNode";
import GraphQLProjectEdge from "../edges/GraphQLProjectEdge";
import GraphQLProject from "../nodes/GraphQLProject";
import GraphQLPage from "./GraphQLPage";
import GraphQLPageInfo from "./GraphQLPageInfo";

export default new GraphQLObjectType({
    name: "ProjectPage",
    description: "A page of projects",
    interfaces: [GraphQLPage],
    fields: {
        nodes: {
            type: GraphQLList(GraphQLProject),
            description: "All projects on this page"
        },
        edges: {
            type: GraphQLList(GraphQLProjectEdge),
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