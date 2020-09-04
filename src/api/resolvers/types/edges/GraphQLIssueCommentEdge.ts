import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import GraphQLIssueCategory from "../../enums/GraphQLIssueCategory";
import GraphQLIssue from "../nodes/GraphQLIssue";
import GraphQLComponent from "../nodes/GraphQLComponent";
import GraphQLComponentInterface from "../nodes/GraphQLComponentInterface";
import GraphQLIssueComment from "../nodes/timelineItems/GraphQLIssueComment";

export default new GraphQLObjectType({
    name: "IssueCommentEdge",
    description: "An edge for an IssueCommentPage to link a cursor to an element",
    fields: {
        node: {
            type: GraphQLIssueComment,
            description: "The issue comment linked to by this edge"
        },
        cursor: {
            type: GraphQLNonNull(GraphQLString),
            description: "The cursor for use in the pagination"
        }
    }
});