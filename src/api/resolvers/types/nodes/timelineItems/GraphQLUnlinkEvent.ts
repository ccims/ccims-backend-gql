import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { UnlinkEvent } from "../../../../../common/nodes/timelineItems/UnlinkEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLIssue from "../GraphQLIssue";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";

const unlinkEventConfig: GraphQLObjectTypeConfig<UnlinkEvent, ResolverContext> = {
    name: "UnlinkEvent",
    description: "An UnlinkEvent in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<UnlinkEvent>("UnlinkEvent"),
        removedLinkedIssue: {
            type: GraphQLIssue,
            description: "The issue this issue __linked to__ before this event"
        }
    })
};
const GraphQLUnlinkEvent = new GraphQLObjectType(unlinkEventConfig);
export default GraphQLUnlinkEvent;