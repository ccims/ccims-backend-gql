import { GraphQLObjectType, GraphQLNonNull, GraphQLObjectTypeConfig } from "graphql";
import { CategoryChangedEvent } from "../../../../../common/nodes/timelineItems/CategoryChangedEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";
import GraphQLIssueCategory from "../../../enums/GraphQLIssueCategory";

const categoryChangedEventConfig: GraphQLObjectTypeConfig<CategoryChangedEvent, ResolverContext> = {
    name: "CategoryChangedEvent",
    description: "An CategoryChangedEvent in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<CategoryChangedEvent>("CategoryChangedEvent"),
        oldCategory: {
            type: GraphQLNonNull(GraphQLIssueCategory),
            description: "The old category of the issue"
        },
        newCategory: {
            type: GraphQLNonNull(GraphQLIssueCategory),
            description: "The new updated issue category"
        }
    })
};
const GraphQLCategoryChangedEvent = new GraphQLObjectType(categoryChangedEventConfig);
export default GraphQLCategoryChangedEvent;