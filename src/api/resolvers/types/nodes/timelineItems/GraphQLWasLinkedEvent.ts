import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { WasLinkedEvent } from "../../../../../common/nodes/timelineItems/WasLinkedEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLIssue from "../GraphQLIssue";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";

const wasLinkedEventConfig: GraphQLObjectTypeConfig<WasLinkedEvent, ResolverContext> = {
    name: "WasLinkedEvent",
    description: "An WasLinkedEvent in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<WasLinkedEvent>("WasLinkedEvent"),
        linkedBy: {
            type: GraphQLIssue,
            description: "The issue which this issue is linked to after this event, null if deleted"
        }
    })
};
const GraphQLWasLinkedEvent = new GraphQLObjectType(wasLinkedEventConfig);
export default GraphQLWasLinkedEvent;