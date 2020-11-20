import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLObjectTypeConfig } from "graphql";
import GraphQLIssueTimelineItem from "../nodes/GraphQLIssueTimelineItem";
import { ResolverContext } from "../../../ResolverContext";

const issueTimelineItemEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "IssueTimelineItemEdge",
    description: "An edge for an IssueTimelineItemPage to link a cursor to an element",
    fields: () => ({
        node: {
            type: GraphQLIssueTimelineItem,
            description: "The issue timeline item linked to by this edge"
        },
        cursor: {
            type: GraphQLNonNull(GraphQLString),
            description: "The cursor for use in the pagination"
        }
    })
};
const GraphQLIssueTimelineItemEdge = new GraphQLObjectType(issueTimelineItemEdgeConfig);
export default GraphQLIssueTimelineItemEdge;