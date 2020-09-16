import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLObjectTypeConfig } from "graphql";
import { ReferencedByIssueEvent } from "../../../../../common/nodes/timelineItems/ReferencedByIssueEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLIssue from "../GraphQLIssue";
import GraphQLUser from "../GraphQLUser";
import GraphQLDate from "../../../scalars/GraphQLDate";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem from "../GraphQLIssueTimelineItem";
import GraphQLIssueComment from "./GraphQLIssueComment";

let referencedByIssueEventConfig: GraphQLObjectTypeConfig<ReferencedByIssueEvent, ResolverContext> = {
    name: "ReferencedByIssueEvent",
    description: "An ReferencedByIssueEvent in the timeline of an issue with a date and a creator\n\n" +
        "This occurs if this issue is referenced by another known issue",
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
        mentionedAt: {
            type: GraphQLIssue,
            description: "The issue by which this issue was referenced"
        },
        mentionedInComment: {
            type: GraphQLIssueComment,
            description: "The comment in which the reference to this issue was made"
        }
    })
};
let GraphQLReferencedByIssueEvent = new GraphQLObjectType(referencedByIssueEventConfig);
export default GraphQLReferencedByIssueEvent;