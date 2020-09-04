import { GraphQLFieldConfig, GraphQLString, GraphQLInt } from "graphql";
import GraphQLIssueFilter from "../../types/filters/GraphQLIssueFilter";
import GraphQLIssuePage from "../../types/pages/GraphQLIssuePage";
import GraphQLUserPage from "../../types/pages/GraphQLUserPage";
import GraphQLUserFilter from "../../types/filters/GraphQLUserFilter";

let participants: GraphQLFieldConfig<any, any, any> = {
    type: GraphQLUserPage,
    description: `All users participating on this issue (by writing a comment, etc.), matching the given filter.\n
    If no filter is given, all users will be returned`,
    args: {
        after: {
            type: GraphQLString,
            description: "Return only users AFTER the one with the specified cursor (exclusive)"
        },
        before: {
            type: GraphQLString,
            description: "Return only users BEFORE the one with the specified cursor (exclusive)"
        },
        filterBy: {
            type: GraphQLUserFilter,
            description: "Return only users matching this filter"
        },
        first: {
            type: GraphQLInt,
            description: "Return at most the first n users"
        },
        last: {
            type: GraphQLInt,
            description: "Return at most the last n users"
        }
    }
};
export default participants;