import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { ReferencedByIssueEvent } from "../../../../../common/nodes/timelineItems/ReferencedByIssueEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLIssue from "../GraphQLIssue";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";
import GraphQLIssueComment from "./GraphQLIssueComment";

const referencedByIssueEventConfig: GraphQLObjectTypeConfig<ReferencedByIssueEvent, ResolverContext> = {
    name: "ReferencedByIssueEvent",
    description: "An ReferencedByIssueEvent in the timeline of an issue with a date and a creator\n\n" +
        "This occurs if this issue is referenced by another known issue",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<ReferencedByIssueEvent>("ReferencedByIssueEvent"),
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
const GraphQLReferencedByIssueEvent = new GraphQLObjectType(referencedByIssueEventConfig);
export default GraphQLReferencedByIssueEvent;