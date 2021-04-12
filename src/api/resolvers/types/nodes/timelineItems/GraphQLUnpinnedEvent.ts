import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { UnpinnedEvent } from "../../../../../common/nodes/timelineItems/UnpinnedEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";
import GraphQLComponent from "../GraphQLComponent";

const unpinnedEventConfig: GraphQLObjectTypeConfig<UnpinnedEvent, ResolverContext> = {
    name: "UnpinnedEvent",
    description: "An UnpinnedEvent in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<UnpinnedEvent>("UnpinnedEvent"),
        component: {
            type: GraphQLComponent,
            description: "The component the issue was previously pinned on, null if deleted"
        }
    })
};
const GraphQLUnpinnedEvent = new GraphQLObjectType(unpinnedEventConfig);
export default GraphQLUnpinnedEvent;