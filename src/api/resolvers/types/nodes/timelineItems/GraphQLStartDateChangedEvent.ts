import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { StartDateChangedEvent } from "../../../../../common/nodes/timelineItems/StartDateChangedEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLDate from "../../../scalars/GraphQLDate";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";

const startDateChangedEventConfig: GraphQLObjectTypeConfig<StartDateChangedEvent, ResolverContext> = {
    name: "StartDateChangedEvent",
    description: "An StartDateChangedEvent in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<StartDateChangedEvent>("StartDateChangedEvent"),
        oldStartDate: {
            type: GraphQLDate,
            description: "The start date set for the issue before it was changed"
        },
        newStartDate: {
            type: GraphQLDate,
            description: "The new set start date for the issue"
        }
    })
};
const GraphQLStartDateChangedEvent = new GraphQLObjectType(startDateChangedEventConfig);
export default GraphQLStartDateChangedEvent;