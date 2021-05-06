import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { MarkedAsDuplicateEvent } from "../../../../../common/nodes/timelineItems/MarkedAsDuplicateEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLIssue from "../GraphQLIssue";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";

const markedAsDuplicateEventConfig: GraphQLObjectTypeConfig<MarkedAsDuplicateEvent, ResolverContext> = {
    name: "MarkedAsDuplicateEvent",
    description: "An MarkedAsDuplicateEvent in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<MarkedAsDuplicateEvent>("MarkedAsDuplicateEvent"),
        originalIssue: {
            type: GraphQLIssue,
            description: "The issue of which __this__ issue is a duplicate, null if deleted"
        }
    })
};
const GraphQLMarkedAsDuplicateEvent = new GraphQLObjectType(markedAsDuplicateEventConfig);
export default GraphQLMarkedAsDuplicateEvent;