import { GraphQLFieldConfig, GraphQLString, GraphQLInt } from "graphql";
import GraphQLIssueFilter from "../../types/filters/GraphQLIssueFilter";
import GraphQLIssuePage from "../../types/pages/GraphQLIssuePage";
import GraphQLIssueTimelineItemPage from "../../types/pages/GraphQLIssueTimelineItemPage";
import GraphQLIssueTimelineItemFilter from "../../types/filters/GraphQLIssueTimelineItemFilter";

let timeline: GraphQLFieldConfig<any, any, any> | undefined = undefined;
export default () => {
    if (timeline === undefined) {
        timeline = {
            type: GraphQLIssueTimelineItemPage,
            description: "All timeline events for this issue in chonological order from oldest to newest, matching the given filter.\n" +
                "If no filter is given, all events will be returned",
            args: {
                after: {
                    type: GraphQLString,
                    description: "Return only timeline events AFTER the one with the specified cursor (exclusive)"
                },
                before: {
                    type: GraphQLString,
                    description: "Return only timeline events BEFORE the one with the specified cursor (exclusive)"
                },
                filterBy: {
                    type: GraphQLIssueTimelineItemFilter,
                    description: "Return only timeline events matching this filter"
                },
                first: {
                    type: GraphQLInt,
                    description: "Return at most the first n timeline events"
                },
                last: {
                    type: GraphQLInt,
                    description: "Return at most the last n timeline events"
                }
            }
        };
    }
    return timeline;
};