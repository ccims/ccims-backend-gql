import { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLObjectTypeConfig } from "graphql";
import GraphQLPage from "./GraphQLPage";
import GraphQLPageInfo from "./GraphQLPageInfo";
import GraphQLIssueTimelineItem from "../nodes/GraphQLIssueTimelineItem";
import GraphQLIssueTimelineItemEdge from "../edges/GraphQLIssueTimelineItemEdge";
import { ResolverContext } from "../../../ResolverContext";

const issueTimelineItemPageConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "IssueTimelineItemPage",
    description: "A page of multiple issue timeline items",
    interfaces: () => ([GraphQLPage]),
    fields: () => ({
        nodes: {
            type: GraphQLList(GraphQLIssueTimelineItem),
            description: "All issue timeline items on this page"
        },
        edges: {
            type: GraphQLList(GraphQLIssueTimelineItemEdge),
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
const GraphQLIssueTimelineItemPage = new GraphQLObjectType(issueTimelineItemPageConfig);
export default GraphQLIssueTimelineItemPage