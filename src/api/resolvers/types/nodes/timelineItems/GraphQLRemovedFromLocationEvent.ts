import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { RemovedFromLocationEvent } from "../../../../../common/nodes/timelineItems/RemovedFromLocationEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";
import GraphQLIssueLocation from "../GraphQLIssueLocation";

const removedFromLocationEventConfig: GraphQLObjectTypeConfig<RemovedFromLocationEvent, ResolverContext> = {
    name: "RemovedFromLocationEvent",
    description: "An RemovedFromLocationEvent in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<RemovedFromLocationEvent>("RemovedFromLocationEvent"),
        removedLocation: {
            type: GraphQLIssueLocation,
            description: "The location the issue was removed from, null if deleted"
        }
    })
};
const GraphQLRemovedFromLocationEvent = new GraphQLObjectType(removedFromLocationEventConfig);
export default GraphQLRemovedFromLocationEvent;