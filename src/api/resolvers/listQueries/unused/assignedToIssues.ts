import { GraphQLFieldConfig, GraphQLInt, GraphQLString } from "graphql";
import GraphQLIssueFilter from "../../types/filters/GraphQLIssueFilter";
import GraphQLIssuePage from "../../types/pages/GraphQLIssuePage";

let assignedToIssues: GraphQLFieldConfig<any, any, any> | undefined;
export default () => {
    if (assignedToIssues === undefined) {
        assignedToIssues = {
            type: GraphQLIssuePage,
            description: "Returns all issues this user is explicitly assigned to",
            args: {
                after: {
                    type: GraphQLString,
                    description: "Return only issues AFTER the one with the specified cursor (exclusive)"
                },
                before: {
                    type: GraphQLString,
                    description: "Return only issues BEFORE the one with the specified cursor (exclusive)"
                },
                filterBy: {
                    type: GraphQLIssueFilter,
                    description: "Return only issues matching this filter"
                },
                first: {
                    type: GraphQLInt,
                    description: "Return at most the first n issues"
                },
                last: {
                    type: GraphQLInt,
                    description: "Return at most the last n issues"
                }
            }
        };
    }
    return assignedToIssues;
};