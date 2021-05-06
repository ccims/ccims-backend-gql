import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { AssignedEvent } from "../../../../../common/nodes/timelineItems/AssignedEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLUser from "../GraphQLUser";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";

const assignedEventConfig: GraphQLObjectTypeConfig<AssignedEvent, ResolverContext> = {
    name: "AssignedEvent",
    description: "An AssignedEvent in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<AssignedEvent>("AssignedEvent"),
        assignee: {
            type: GraphQLUser,
            description: "The user which was newly assigned to this issue, null if deleted"
        }
    })
};
const GraphQLAssignedEvent = new GraphQLObjectType(assignedEventConfig);
export default GraphQLAssignedEvent;