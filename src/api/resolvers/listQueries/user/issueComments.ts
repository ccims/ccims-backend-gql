import { GraphQLFieldConfig, GraphQLInt, GraphQLString } from "graphql";
import GraphQLIssueFilter from "../../types/filters/GraphQLIssueFilter";

let issueComments: GraphQLFieldConfig<any, any, any> = {
    type: GraphQLIssueCommentPage,
    description: "Returns all comments this user has written in any issue",
    args: {
        after: {
            type: GraphQLString,
            description: "Return only comments AFTER the one with the specified cursor (exclusive)"
        },
        before: {
            type: GraphQLString,
            description: "Return only comments BEFORE the one with the specified cursor (exclusive)"
        },
        filterBy: {
            type: GraphQLIssueFilter,
            description: "Return only comments matching this filter"
        },
        first: {
            type: GraphQLInt,
            description: "Return at most the first n comments"
        },
        last: {
            type: GraphQLInt,
            description: "Return at most the last n comments"
        }
    }
};
export default issueComments;