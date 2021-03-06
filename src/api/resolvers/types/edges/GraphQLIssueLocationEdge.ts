import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLObjectTypeConfig } from "graphql";
import GraphQLIssueLocation from "../nodes/GraphQLIssueLocation";
import { ResolverContext } from "../../../ResolverContext";

const issueLocationEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "IssueLocationEdge",
    description: "An edge for an IssueLocationPage to link a cursor to an element",
    fields: () => ({
        node: {
            type: GraphQLIssueLocation,
            description: "The issue location linked to by this edge"
        },
        cursor: {
            type: GraphQLNonNull(GraphQLString),
            description: "The cursor for use in the pagination"
        }
    })
};
const GraphQLIssueLocationEdge = new GraphQLObjectType(issueLocationEdgeConfig);
export default GraphQLIssueLocationEdge;