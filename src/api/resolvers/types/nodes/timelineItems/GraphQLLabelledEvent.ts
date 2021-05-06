import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { LabelledEvent } from "../../../../../common/nodes/timelineItems/LabelledEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";
import GraphQLLabel from "../GraphQLLabel";

const labelledEventConfig: GraphQLObjectTypeConfig<LabelledEvent, ResolverContext> = {
    name: "LabelledEvent",
    description: "An LabelledEvent in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<LabelledEvent>("LabelledEvent"),
        label: {
            type: GraphQLLabel,
            description: "The label which was added to the issue, null if deleted"
        }
    })
};
const GraphQLLabelledEvent = new GraphQLObjectType(labelledEventConfig);
export default GraphQLLabelledEvent;