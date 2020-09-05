import { GraphQLFieldConfig, GraphQLString, GraphQLInt } from "graphql";
import GraphQLIssueFilter from "../types/filters/GraphQLIssueFilter";
import GraphQLIssuePage from "../types/pages/GraphQLIssuePage";

let issuesOnLocation: GraphQLFieldConfig<any, any, any> | undefined = undefined;
export default () => {
    if (issuesOnLocation === undefined) {
        issuesOnLocation = {
            type: GraphQLIssuePage,
            description: `Only returnes issues which are assigned to this __location__ matching the filter\n\n
            (for a component this won't return all issues of a component - Issues that are only on iterfaces won't be returned).\n
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
        }
    }
    return issuesOnLocation;
};