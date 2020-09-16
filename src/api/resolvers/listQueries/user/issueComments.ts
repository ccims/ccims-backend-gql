import { GraphQLFieldConfig, GraphQLString, GraphQLInt } from "graphql";
import GraphQLIssueCommentFilter from "../../types/filters/GraphQLIssueCommentFilter";
import GraphQLIssueCommentPage from "../../types/pages/GraphQLIssueCommentPage";

let issueComments: GraphQLFieldConfig<any, any, any> | undefined = undefined;
export default () => {
    if (issueComments === undefined) {
        issueComments = {
            type: GraphQLIssueCommentPage,
            description: "All comments written by this user, matching the given filter.\n" +
                "If no filter is given, all comments will be returned",
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
                    type: GraphQLIssueCommentFilter,
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
    }
    return issueComments;
};