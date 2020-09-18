import { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLObjectTypeConfig } from "graphql";
import GraphQLPage from "./GraphQLPage";
import GraphQLPageInfo from "./GraphQLPageInfo";
import GraphQLIssueComment from "../nodes/timelineItems/GraphQLIssueComment";
import GraphQLIssueCommentEdge from "../edges/GraphQLIssueCommentEdge";
import { ResolverContext } from "../../../ResolverContext";

const issueCommentPageConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "IssueCommentPage",
    description: "A page of multiple issue comments",
    interfaces: () => ([GraphQLPage]),
    fields: () => ({
        nodes: {
            type: GraphQLList(GraphQLIssueComment),
            description: "All issue comments on this page"
        },
        edges: {
            type: GraphQLList(GraphQLIssueCommentEdge),
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
const GraphQLIssueCommentPage = new GraphQLObjectType(issueCommentPageConfig);
export default GraphQLIssueCommentPage;