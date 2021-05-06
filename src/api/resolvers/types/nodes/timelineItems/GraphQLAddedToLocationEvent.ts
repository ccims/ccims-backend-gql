import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { AddedToLocationEvent } from "../../../../../common/nodes/timelineItems/AddedToLocationEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";
import GraphQLIssueLocation from "../GraphQLIssueLocation";

const addedToLocationEventConfig: GraphQLObjectTypeConfig<AddedToLocationEvent, ResolverContext> = {
    name: "AddedToLocationEvent",
    description: "An AddedToLocationEvent in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<AddedToLocationEvent>("AddedToLocationEvent"),
        location: {
            type: GraphQLIssueLocation,
            description: "The location the issue was added to, null if deleted"
        }
    })
};
const GraphQLAddedToLocationEvent = new GraphQLObjectType(addedToLocationEventConfig);
export default GraphQLAddedToLocationEvent;