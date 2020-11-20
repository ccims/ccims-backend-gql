import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLObjectTypeConfig } from "graphql";
import GraphQLIssueCategory from "../../enums/GraphQLIssueCategory";
import GraphQLIssue from "../nodes/GraphQLIssue";
import GraphQLComponent from "../nodes/GraphQLComponent";
import GraphQLComponentInterface from "../nodes/GraphQLComponentInterface";
import GraphQLIssueComment from "../nodes/timelineItems/GraphQLIssueComment";
import { ResolverContext } from "../../../ResolverContext";

const issueCommentEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "IssueCommentEdge",
    description: "An edge for an IssueCommentPage to link a cursor to an element",
    fields: () => ({
        node: {
            type: GraphQLIssueComment,
            description: "The issue comment linked to by this edge"
        },
        cursor: {
            type: GraphQLNonNull(GraphQLString),
            description: "The cursor for use in the pagination"
        }
    })
};
const GraphQLIssueCommentEdge = new GraphQLObjectType(issueCommentEdgeConfig);
export default GraphQLIssueCommentEdge;