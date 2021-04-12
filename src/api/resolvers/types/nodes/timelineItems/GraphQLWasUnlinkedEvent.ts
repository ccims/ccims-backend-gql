import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { WasUnlinkedEvent } from "../../../../../common/nodes/timelineItems/WasUnlinkedEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLIssue from "../GraphQLIssue";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";

const wasUnlinkedEventConfig: GraphQLObjectTypeConfig<WasUnlinkedEvent, ResolverContext> = {
    name: "WasUnlinkedEvent",
    description: "An WasUnlinkedEvent in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<WasUnlinkedEvent>("WasUnlinkedEvent"),
        unlinkedBy: {
            type: GraphQLIssue,
            description: "The issue which this issue was linked to before this event, null if deleted"
        }
    })
};
const GraphQLWasUnlinkedEvent = new GraphQLObjectType(wasUnlinkedEventConfig);
export default GraphQLWasUnlinkedEvent;