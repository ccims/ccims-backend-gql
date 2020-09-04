import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import GraphQLIssueCategory from "../../enums/GraphQLIssueCategory";
import GraphQLIssue from "../nodes/GraphQLIssue";
import GraphQLIssueLocation from "../GraphQLIssueLocation";

export default new GraphQLObjectType({
    name: "IssueLocationEdge",
    description: "An edge for an IssueLocationPage to link a cursor to an element",
    fields: {
        node: {
            type: GraphQLIssueLocation,
            description: "The issue location linked to by this edge"
        },
        cursor: {
            type: GraphQLNonNull(GraphQLString),
            description: "The cursor for use in the pagination"
        }
    }
});