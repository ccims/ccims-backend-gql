import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import GraphQLIssueCategory from "../../enums/GraphQLIssueCategory";
import GraphQLIssue from "../nodes/GraphQLIssue";

export default new GraphQLObjectType({
    name: "IssueEdge",
    description: "An edge for a IssuePage to link a cursor to an element",
    fields: {
        node: {
            type: GraphQLIssue,
            description: "The issue linked to by this edge"
        },
        cursor: {
            type: GraphQLNonNull(GraphQLString),
            description: "The cursor for use in the pagination"
        }
    }
});