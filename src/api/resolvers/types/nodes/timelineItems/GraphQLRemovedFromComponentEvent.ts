import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { RemovedFromComponentEvent } from "../../../../../common/nodes/timelineItems/RemovedFromComponentEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";
import GraphQLComponent from "../GraphQLComponent";

const removedFromComponentEventConfig: GraphQLObjectTypeConfig<RemovedFromComponentEvent, ResolverContext> = {
    name: "RemovedFromComponentEvent",
    description: "An RemovedFromComponentEvent in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<RemovedFromComponentEvent>("RemovedFromComponentEvent"),
        removedComponent: {
            type: GraphQLComponent,
            description: "The component the issue was removed from, null if deleted"
        }
    })
};
const GraphQLRemovedFromComponentEvent = new GraphQLObjectType(removedFromComponentEventConfig);
export default GraphQLRemovedFromComponentEvent;