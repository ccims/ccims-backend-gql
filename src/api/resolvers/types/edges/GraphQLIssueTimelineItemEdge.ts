import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import GraphQLIssueCategory from "../../enums/GraphQLIssueCategory";
import GraphQLIssue from "../nodes/GraphQLIssue";
import GraphQLIssueTimelineItem from "../nodes/GraphQLIssueTimelineItem";

export default new GraphQLObjectType({
    name: "IssueTimelineItemEdge",
    description: "An edge for an IssueTimelineItemPage to link a cursor to an element",
    fields: {
        node: {
            type: GraphQLIssueTimelineItem,
            description: "The issue timeline item linked to by this edge"
        },
        cursor: {
            type: GraphQLNonNull(GraphQLString),
            description: "The cursor for use in the pagination"
        }
    }
});