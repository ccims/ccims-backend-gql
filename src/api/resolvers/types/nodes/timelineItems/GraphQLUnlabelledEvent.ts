import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { UnlabelledEvent } from "../../../../../common/nodes/timelineItems/UnlabelledEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";
import GraphQLLabel from "../GraphQLLabel";

const unlabelledEventConfig: GraphQLObjectTypeConfig<UnlabelledEvent, ResolverContext> = {
    name: "UnlabelledEvent",
    description: "An UnlabelledEvent in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<UnlabelledEvent>("UnlabelledEvent"),
        removedLabel: {
            type: GraphQLLabel,
            description: "The label which was removed from the issue on this event, null if deleted"
        }
    })
};
const GraphQLUnlabelledEvent = new GraphQLObjectType(unlabelledEventConfig);
export default GraphQLUnlabelledEvent;