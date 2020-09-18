import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLID, GraphQLInputObjectTypeConfig } from "graphql";
import GraphQLDate from "../../scalars/GraphQLDate";
import GraphQLIssueTimelineItemType from "../../enums/GraphQLIssueTimelineItemType";

let issueTimelineItemFilterConfig: GraphQLInputObjectTypeConfig = {
    name: "IssueTimelineItemFilter",
    description: "Filters for certain timeline events. All parameters given in this filter will be connected via _AND_\n\n" +
        "__Please note:__ It's currently __not__ possible to filter for specific properties of an event. Might be added in future",
    fields: () => ({
        createdBy: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "Filters for the creator user of the timeline event. The id of the user must match any of the given ids"
        },
        createdAfter: {
            type: GraphQLDate,
            description: "The timeline event must have occurred after the given date (inclusive) to match the filter"
        },
        createdBefore: {
            type: GraphQLDate,
            description: "The timeline event must have occurred before the given date (inclusive) to match the filter"
        },
        type: {
            type: GraphQLList(GraphQLNonNull(GraphQLIssueTimelineItemType)),
            description: "The type of the timeline item must match one of the given ones"
        }
    })
};
let GraphQLIssueTimelineItemFilter = new GraphQLInputObjectType(issueTimelineItemFilterConfig);
export default GraphQLIssueTimelineItemFilter;