import { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLInt } from "graphql";
import GraphQLPage from "./GraphQLPage";
import GraphQLIssueEdge from "../edges/GraphQLIssueEdge";
import GraphQLIssue from "../nodes/GraphQLIssue";
import GraphQLPageInfo from "./GraphQLPageInfo";
import GraphQLIssueLocation from "../GraphQLIssueLocation";
import GraphQLIssueLocationEdge from "../edges/GraphQLIssueLocationEdge";

export default new GraphQLObjectType({
    name: "IssueLocationPage",
    description: "A page of multiple issue locations",
    interfaces: [GraphQLPage],
    fields: {
        nodes: {
            type: GraphQLList(GraphQLIssueLocation),
            description: "All issue locations on this page"
        },
        edges: {
            type: GraphQLList(GraphQLIssueLocationEdge),
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