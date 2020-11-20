import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLBoolean, GraphQLInputObjectTypeConfig } from "graphql";
import GraphQLDate from "../../scalars/GraphQLDate";

const issueCommentFilterConfig: GraphQLInputObjectTypeConfig = {
    name: "IssueCommentFilter",
    description: "Filter for comments on issues (not including the issue bodies themselves). All parameters given in this filter will be connected via _AND_",
    fields: () => ({
        issue: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "The id of the issue the comment belongs to must match any of the given ids"
        },
        createdBy: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "The id of the user creating the comment.Must match any one of the given ids"
        },
        editedBy: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "The id of the user who __last__ edited the comment must match any of the given ids"
        },
        createdAfter: {
            type: GraphQLDate,
            description: "Match all comments created after the given date (inclusive)"
        },
        createdBefore: {
            type: GraphQLDate,
            description: "Match all comments created before the given date (inclusive)"
        },
        editedAfter: {
            type: GraphQLDate,
            description: "Match all comments last edited after the given date (inclusive)"
        },
        editedBefore: {
            type: GraphQLDate,
            description: "Match all comments last edited before the given date (inclusive)"
        },
        body: {
            type: GraphQLString,
            description: "The body of a comment must match this __RegEx__ to match the filter"
        },
        reactions: {
            type: GraphQLList(GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLString)))),
            description: "A comment must have all the reactions in one of the lists given."
        },
        currentUserCanEdit: {
            type: GraphQLBoolean,
            description: "If given, filters for comments which the user either has or hasn't got edit permissions"
        }
    })
};
const GraphQLIssueCommentFilter = new GraphQLInputObjectType(issueCommentFilterConfig);
export default GraphQLIssueCommentFilter;