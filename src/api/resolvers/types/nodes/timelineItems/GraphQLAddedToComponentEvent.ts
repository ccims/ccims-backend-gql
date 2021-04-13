import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { AddedToComponentEvent } from "../../../../../common/nodes/timelineItems/AddedToComponentEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";
import GraphQLComponent from "../GraphQLComponent";

const addedToComponentEventConfig: GraphQLObjectTypeConfig<AddedToComponentEvent, ResolverContext> = {
    name: "AddedToComponentEvent",
    description: "An AddedToComponentEvent in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<AddedToComponentEvent>("AddedToComponentEvent"),
        component: {
            type: GraphQLComponent,
            description: "The component the issue was added to, null if deleted"
        }
    })
};
const GraphQLAddedToComponentEvent = new GraphQLObjectType(addedToComponentEventConfig);
export default GraphQLAddedToComponentEvent;