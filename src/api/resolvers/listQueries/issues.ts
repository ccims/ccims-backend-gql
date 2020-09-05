import { GraphQLFieldConfig, GraphQLString, GraphQLInt } from "graphql";
import GraphQLIssueFilter from "../types/filters/GraphQLIssueFilter";
import GraphQLIssuePage from "../types/pages/GraphQLIssuePage";

let issues: GraphQLFieldConfig<any, any, any> | undefined = undefined;
export default () => {
    if (issues === undefined) {
        issues = {
            type: GraphQLIssuePage,
            description: `All issues on this node, matching the given filter.\n
            These are all issues regardless on which components/interfaces they are located.\n\n
            If no filter is given, all issues will be returned`,
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
    return issues;
};