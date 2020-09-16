import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLObjectTypeConfig } from "graphql";
import { PriorityChangedEvent } from "../../../../../common/nodes/timelineItems/PriorityChangedEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLIssue from "../GraphQLIssue";
import GraphQLUser from "../GraphQLUser";
import GraphQLDate from "../../../scalars/GraphQLDate";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem from "../GraphQLIssueTimelineItem";
import GraphQLPriority from "../../../enums/GraphQLPriority";

let priorityChangedEventConfig: GraphQLObjectTypeConfig<PriorityChangedEvent, ResolverContext> = {
    name: "PriorityChangedEvent",
    description: "An PriorityChangedEvent in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLID),
            description: "The unique id of this timeline item"
        },
        issue: {
            type: GraphQLNonNull(GraphQLIssue),
            description: "The issue this timeline event belongs to"
        },
        createdBy: {
            type: GraphQLUser,
            description: "The user responsible for the creation of the event (e.g. autor of a comment)\n\n" +
                "It's possible there is no autor, for example if the action was performed automatically"
        },
        createdAt: {
            type: GraphQLNonNull(GraphQLDate),
            description: "The date the event occured on/was created.\n\nThis ISN'T updated if the event is be changed"
        },
        oldPriority: {
            type: GraphQLPriority,
            description: "The old priority of the issue"
        },
        newPriority: {
            type: GraphQLPriority,
            description: "The new updated priority of the issue"
        }
    })
};
let GraphQLPriorityChangedEvent = new GraphQLObjectType(priorityChangedEventConfig);
export default GraphQLPriorityChangedEvent;