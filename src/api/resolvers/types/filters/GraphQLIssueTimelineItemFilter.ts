import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLInputObjectTypeConfig } from "graphql";
import GraphQLIssueTimelineItemType from "../../enums/GraphQLIssueTimelineItemType";
import { syncNodeFilterFields } from "./syncNodeFilterFields";
import { IssueTimelineItem } from "../../../../common/nodes/timelineItems/IssueTimelineItem";

const issueTimelineItemFilterConfig: GraphQLInputObjectTypeConfig = {
    name: "IssueTimelineItemFilter",
    description: "Filters for certain timeline events. All parameters given in this filter will be connected via _AND_\n\n" +
        "__Please note:__ It's currently __not__ possible to filter for specific properties of an event. Might be added in future",
    fields: () => ({
        ...syncNodeFilterFields<IssueTimelineItem>("IssueTimelineItem"),
        type: {
            type: GraphQLList(GraphQLNonNull(GraphQLIssueTimelineItemType)),
            description: "The type of the timeline item must match one of the given ones"
        }
    })
};
const GraphQLIssueTimelineItemFilter = new GraphQLInputObjectType(issueTimelineItemFilterConfig);
export default GraphQLIssueTimelineItemFilter;