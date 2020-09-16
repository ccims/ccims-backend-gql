import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLObjectTypeConfig } from "graphql";
import { StartDateChangedEvent } from "../../../../../common/nodes/timelineItems/StartDateChangedEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLIssue from "../GraphQLIssue";
import GraphQLUser from "../GraphQLUser";
import GraphQLDate from "../../../scalars/GraphQLDate";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem from "../GraphQLIssueTimelineItem";

let startDateChangedEventConfig: GraphQLObjectTypeConfig<StartDateChangedEvent, ResolverContext> = {
    name: "StartDateChangedEvent",
    description: "An StartDateChangedEvent in the timeline of an issue with a date and a creator",
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
        oldStartDate: {
            type: GraphQLDate,
            description: "The start date set for the issue before it was changed"
        },
        newStartDate: {
            type: GraphQLDate,
            description: "The new set start date for the issue"
        }
    })
};
let GraphQLStartDateChangedEvent = new GraphQLObjectType(startDateChangedEventConfig);
export default GraphQLStartDateChangedEvent;