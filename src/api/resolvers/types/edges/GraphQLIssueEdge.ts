import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLObjectTypeConfig } from "graphql";
import GraphQLIssue from "../nodes/GraphQLIssue";
import { ResolverContext } from "../../../ResolverContext";

const issueEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "IssueEdge",
    description: "An edge for an IssuePage to link a cursor to an element",
    fields: () => ({
        node: {
            type: GraphQLIssue,
            description: "The issue linked to by this edge"
        },
        cursor: {
            type: GraphQLNonNull(GraphQLString),
            description: "The cursor for use in the pagination"
        }
    })
};
const GraphQLIssueEdge = new GraphQLObjectType(issueEdgeConfig);
export default GraphQLIssueEdge;