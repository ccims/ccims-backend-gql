import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { PriorityChangedEvent } from "../../../../../common/nodes/timelineItems/PriorityChangedEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";
import GraphQLPriority from "../../../enums/GraphQLPriority";

const priorityChangedEventConfig: GraphQLObjectTypeConfig<PriorityChangedEvent, ResolverContext> = {
    name: "PriorityChangedEvent",
    description: "An PriorityChangedEvent in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<PriorityChangedEvent>("PriorityChangedEvent"),
        oldPriority: {
            type: GraphQLPriority,
            description: "The old priority of the issue"
        },
        newPriority: {
            type: GraphQLPriority,
            description: "The new updated priority of the issue"
        }
    })
};
const GraphQLPriorityChangedEvent = new GraphQLObjectType(priorityChangedEventConfig);
export default GraphQLPriorityChangedEvent;