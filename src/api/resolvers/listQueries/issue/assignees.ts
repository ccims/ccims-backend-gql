import { GraphQLFieldConfig, GraphQLString, GraphQLInt } from "graphql";
import GraphQLIssueFilter from "../../types/filters/GraphQLIssueFilter";
import GraphQLIssuePage from "../../types/pages/GraphQLIssuePage";
import GraphQLUserPage from "../../types/pages/GraphQLUserPage";
import GraphQLUserFilter from "../../types/filters/GraphQLUserFilter";

let assignees: GraphQLFieldConfig<any, any, any> | undefined = undefined;
export default () => {
    if (assignees === undefined) {
        assignees = {
            type: GraphQLUserPage,
            description: "All users who are explicitely assigned to issue, matching the given filter.\n" +
                "If no filter is given, all issues will be returned",
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
        }
    }
    return assignees;
};