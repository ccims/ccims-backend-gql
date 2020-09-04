import { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLObjectTypeConfig } from "graphql";
import GraphQLPage from "./GraphQLPage";
import GraphQLIssueEdge from "../edges/GraphQLIssueEdge";
import GraphQLIssue from "../nodes/GraphQLIssue";
import GraphQLPageInfo from "./GraphQLPageInfo";
import { ResolverContext } from "../../../ResolverContext";

let issuePageConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "IssuePage",
    description: "A page of multiple issues",
    interfaces: [GraphQLPage],
    fields: () => ({
        nodes: {
            type: GraphQLList(GraphQLIssue),
            description: "All issues on this page"
        },
        edges: {
            type: GraphQLList(GraphQLIssueEdge),
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
let GraphQLIssuePage = new GraphQLObjectType(issuePageConfig);
export default GraphQLIssuePage;