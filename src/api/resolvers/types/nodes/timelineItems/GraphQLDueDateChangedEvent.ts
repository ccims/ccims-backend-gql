import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { DueDateChangedEvent } from "../../../../../common/nodes/timelineItems/DueDateChangedEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLDate from "../../../scalars/GraphQLDate";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";

const dueDateChangedEventConfig: GraphQLObjectTypeConfig<DueDateChangedEvent, ResolverContext> = {
    name: "DueDateChangedEvent",
    description: "An DueDateChangedEvent in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<DueDateChangedEvent>("DueDateChangedEvent"),
        oldDueDate: {
            type: GraphQLDate,
            description: "The old due date"
        },
        newDueDate: {
            type: GraphQLDate,
            description: "The new due date for the issue"
        }
    })
};
const GraphQLDueDateChangedEvent = new GraphQLObjectType(dueDateChangedEventConfig);
export default GraphQLDueDateChangedEvent;