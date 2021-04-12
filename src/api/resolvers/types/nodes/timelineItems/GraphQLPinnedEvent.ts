import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLObjectTypeConfig } from "graphql";
import { PinnedEvent } from "../../../../../common/nodes/timelineItems/PinnedEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";
import GraphQLComponent from "../GraphQLComponent";

const pinnedEventConfig: GraphQLObjectTypeConfig<PinnedEvent, ResolverContext> = {
    name: "PinnedEvent",
    description: "An PinnedEvent in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<PinnedEvent>("PinnedEvent"),
        component: {
            type: GraphQLComponent,
            description: "The component the issue was pinned on, null if deleted"
        }
    })
};
const GraphQLPinnedEvent = new GraphQLObjectType(pinnedEventConfig);
export default GraphQLPinnedEvent;