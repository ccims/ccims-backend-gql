import { GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLString } from "graphql";
import { ReferencedByOtherEvent } from "../../../../../common/nodes/timelineItems/ReferencedByOtherEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";
import GraphQLComponent from "../GraphQLComponent";

const referencedByOtherEventConfig: GraphQLObjectTypeConfig<ReferencedByOtherEvent, ResolverContext> = {
    name: "ReferencedByOtherEvent",
    description: "An ReferencedByOtherEvent in the timeline of an issue with a date and a creator.\n\n" +
        "This occures if this issue is referenced outside of an issue (e.g. pull request etc.)",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<ReferencedByOtherEvent>("ReferencedByOtherEvent"),
        component: {
            type: GraphQLComponent,
            description: "The component from which this issue was referenced, null if deleted"
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