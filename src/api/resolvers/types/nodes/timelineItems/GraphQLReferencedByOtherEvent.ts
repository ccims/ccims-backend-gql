import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLObjectTypeConfig, GraphQLString } from "graphql";
import { ReferencedByOtherEvent } from "../../../../../common/nodes/timelineItems/ReferencedByOtherEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLIssue from "../GraphQLIssue";
import GraphQLUser from "../GraphQLUser";
import GraphQLDate from "../../../scalars/GraphQLDate";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem from "../GraphQLIssueTimelineItem";
import GraphQLComponent from "../GraphQLComponent";

const referencedByOtherEventConfig: GraphQLObjectTypeConfig<ReferencedByOtherEvent, ResolverContext> = {
    name: "ReferencedByOtherEvent",
    description: "An ReferencedByOtherEvent in the timeline of an issue with a date and a creator.\n\n" +
        "This occures if this issue is referenced outside of an issue (e.g. pull request etc.)",
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
        component: {
            type: GraphQLComponent,
            description: "The component from which this issue was referenced"
        },
        source: {
            type: GraphQLString,
            description: "A human readable name of the source of the reference (e.g. 'Pull request #2')"
        },
        sourceURL: {
            type: GraphQLString,
            description: "An URL to where the issue was linked from"
        }
    })
};
const GraphQLReferencedByOtherEvent = new GraphQLObjectType(referencedByOtherEventConfig);
export default GraphQLReferencedByOtherEvent;