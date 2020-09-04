import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLInterfaceType, GraphQLObjectTypeConfig, GraphQLInterfaceTypeConfig } from "graphql";
import GraphQLIssue from "./GraphQLIssue";
import GraphQLUser from "./GraphQLUser";
import GraphQLDate from "../../scalars/GraphQLDate";
import GraphQLNode from "../GraphQLNode";
import { IssueTimelineItem } from "../../../../common/nodes/IssueTimelineItem";
import { ResolverContext } from "../../../ResolverContext";

let issueTimelineItemConfig: GraphQLInterfaceTypeConfig<IssueTimelineItem, ResolverContext> = {
    name: "IssueTimelineItem",
    description: "An event in the timeline of an issue wiht a date and a creator",
    interfaces: [GraphQLNode],
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
            description: `The user responsible for the creation of the event (e.g. autor of a comment)\n\n
            It's possible there is no autor, for example if the action was performed automatically`
        },
        createdAt: {
            type: GraphQLNonNull(GraphQLDate),
            description: "The date the event occured on/was created.\n\nThis ISN'T updated if the event is be changed"
        }
    })
};
let GraphQLIssueTimelineItem = new GraphQLInterfaceType(issueTimelineItemConfig);
export default GraphQLIssueTimelineItem;