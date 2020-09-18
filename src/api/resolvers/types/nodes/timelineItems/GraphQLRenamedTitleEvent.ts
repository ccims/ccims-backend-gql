import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLObjectTypeConfig, GraphQLString } from "graphql";
import { RenamedTitleEvent } from "../../../../../common/nodes/timelineItems/RenamedTitleEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLIssue from "../GraphQLIssue";
import GraphQLUser from "../GraphQLUser";
import GraphQLDate from "../../../scalars/GraphQLDate";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem from "../GraphQLIssueTimelineItem";

const renamedTitleEventConfig: GraphQLObjectTypeConfig<RenamedTitleEvent, ResolverContext> = {
    name: "RenamedTitleEvent",
    description: "An RenamedTitleEvent in the timeline of an issue with a date and a creator",
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
        oldTitle: {
            type: GraphQLNonNull(GraphQLString),
            description: "The title of the issue before the change"
        },
        newTitle: {
            type: GraphQLNonNull(GraphQLString),
            description: "The new updated title of the issue"
        }
    })
};
const GraphQLRenamedTitleEvent = new GraphQLObjectType(renamedTitleEventConfig);
export default GraphQLRenamedTitleEvent;