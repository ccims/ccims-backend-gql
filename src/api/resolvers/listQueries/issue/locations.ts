import { GraphQLFieldConfig, GraphQLString, GraphQLInt } from "graphql";
import GraphQLIssueFilter from "../../types/filters/GraphQLIssueFilter";
import GraphQLIssuePage from "../../types/pages/GraphQLIssuePage";
import GraphQLIssueLocationFilter from "../../types/filters/GraphQLIssueLocationFilter";
import GraphQLIssueLocationPage from "../../types/pages/GraphQLIssueLocationPage";

let locations: GraphQLFieldConfig<any, any, any> | undefined = undefined;
export default () => {
    if (locations === undefined) {
        locations = {
            type: GraphQLIssueLocationPage,
            description: "All locations this issue is assigned to, matching the given filter.\n" +
                "If no filter is given, all locations will be returned",
            args: {
                after: {
                    type: GraphQLString,
                    description: "Return only locations AFTER the one with the specified cursor (exclusive)"
                },
                before: {
                    type: GraphQLString,
                    description: "Return only locations BEFORE the one with the specified cursor (exclusive)"
                },
                filterBy: {
                    type: GraphQLIssueLocationFilter,
                    description: "Return only locations matching this filter"
                },
                first: {
                    type: GraphQLInt,
                    description: "Return at most the first n locations"
                },
                last: {
                    type: GraphQLInt,
                    description: "Return at most the last n locations"
                }
            }
        };
    }
    return locations;
};