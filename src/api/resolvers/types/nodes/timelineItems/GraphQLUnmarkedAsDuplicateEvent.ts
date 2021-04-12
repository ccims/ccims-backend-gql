import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { UnmarkedAsDuplicateEvent } from "../../../../../common/nodes/timelineItems/UnmarkedAsDuplicateEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";

const unmarkedAsDuplicateEventConfig: GraphQLObjectTypeConfig<UnmarkedAsDuplicateEvent, ResolverContext> = {
    name: "UnmarkedAsDuplicateEvent",
    description: "An UnmarkedAsDuplicateEvent in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<UnmarkedAsDuplicateEvent>("UnmarkedAsDuplicateEvent"),
    })
};
const GraphQLUnmarkedAsDuplicateEvent = new GraphQLObjectType(unmarkedAsDuplicateEventConfig);
export default GraphQLUnmarkedAsDuplicateEvent;