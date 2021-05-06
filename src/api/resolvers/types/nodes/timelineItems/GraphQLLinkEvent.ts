import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { LinkEvent } from "../../../../../common/nodes/timelineItems/LinkEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLIssue from "../GraphQLIssue";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";

const linkEventConfig: GraphQLObjectTypeConfig<LinkEvent, ResolverContext> = {
    name: "LinkEvent",
    description: "An LinkEvent in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<LinkEvent>("LinkEvent"),
        linkedIssue: {
            type: GraphQLIssue,
            description: "The issue that was linked __to__ (__from__ this issue), nul if deleted"
        }
    })
};
const GraphQLLinkEvent = new GraphQLObjectType(linkEventConfig);
export default GraphQLLinkEvent;