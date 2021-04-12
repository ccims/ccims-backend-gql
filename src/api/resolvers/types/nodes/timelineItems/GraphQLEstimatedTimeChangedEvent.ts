import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { EstimatedTimeChangedEvent } from "../../../../../common/nodes/timelineItems/EstimatedTimeChangedEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";
import GraphQLTimeSpan from "../../../scalars/GraphQLTimeSpan";

const estimatedTimeChangedEventConfig: GraphQLObjectTypeConfig<EstimatedTimeChangedEvent, ResolverContext> = {
    name: "EstimatedTimeChangedEvent",
    description: "An EstimatedTimeChangedEvent in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields("EstimatedTimeChangedEvent"),
        oldEstimatedTime: {
            type: GraphQLTimeSpan,
            description: "The old time estimate for the issue"
        },
        newEstimatedTime: {
            type: GraphQLTimeSpan,
            description: "The new updated time estimate for the issue"
        }
    })
};
const GraphQLEstimatedTimeChangedEvent = new GraphQLObjectType(estimatedTimeChangedEventConfig);
export default GraphQLEstimatedTimeChangedEvent;