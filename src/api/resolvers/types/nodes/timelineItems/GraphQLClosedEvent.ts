import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { ClosedEvent } from "../../../../../common/nodes/timelineItems/ClosedEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";

const closedEventConfig: GraphQLObjectTypeConfig<ClosedEvent, ResolverContext> = {
    name: "ClosedEvent",
    description: "An ClosedEvent in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<ClosedEvent>("ClosedEvent")
    })
};
const GraphQLClosedEvent = new GraphQLObjectType(closedEventConfig);
export default GraphQLClosedEvent;