import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { UnassignedEvent } from "../../../../../common/nodes/timelineItems/UnassignedEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLUser from "../GraphQLUser";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";

const unassignedEventConfig: GraphQLObjectTypeConfig<UnassignedEvent, ResolverContext> = {
    name: "UnassignedEvent",
    description: "An UnassignedEvent in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<UnassignedEvent>("UnassignedEvent"),
        removedAssignee: {
            type: GraphQLUser,
            description: "The user which was unassigned from this issue, null if deleted"
        }
    })
};
const GraphQLUnassignedEvent = new GraphQLObjectType(unassignedEventConfig);
export default GraphQLUnassignedEvent;