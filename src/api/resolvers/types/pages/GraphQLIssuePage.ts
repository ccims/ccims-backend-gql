import { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLInt } from "graphql";
import GraphQLPage from "./GraphQLPage";
import GraphQLIssueEdge from "../edges/GraphQLIssueEdge";
import GraphQLIssue from "../nodes/GraphQLIssue";

export default new GraphQLObjectType({
    name: "IssuePage",
    description: "A page of multiple issues",
    interfaces: [GraphQLPage],
    fields: {
        nodes: {
            type: GraphQLList(GraphQLIssue),
            description: "All components on this page"
        },
        edges: {
            type: GraphQLList(GraphQLIssueEdge),
            description: "Edges to all nodes containing the cursor"
        }
    }
});