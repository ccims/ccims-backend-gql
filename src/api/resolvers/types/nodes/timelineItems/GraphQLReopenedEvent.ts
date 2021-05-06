import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { ReopenedEvent } from "../../../../../common/nodes/timelineItems/ReopenedEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";

const reopenedEventConfig: GraphQLObjectTypeConfig<ReopenedEvent, ResolverContext> = {
    name: "ReopenedEvent",
    description: "An ReopenedEvent in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<ReopenedEvent>("ReopenedEvent"),
    })
};
const GraphQLReopenedEvent = new GraphQLObjectType(reopenedEventConfig);
export default GraphQLReopenedEvent;