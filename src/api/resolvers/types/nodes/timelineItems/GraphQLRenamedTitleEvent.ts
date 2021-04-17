import { GraphQLObjectType, GraphQLNonNull, GraphQLObjectTypeConfig, GraphQLString } from "graphql";
import { RenamedTitleEvent } from "../../../../../common/nodes/timelineItems/RenamedTitleEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";

const renamedTitleEventConfig: GraphQLObjectTypeConfig<RenamedTitleEvent, ResolverContext> = {
    name: "RenamedTitleEvent",
    description: "An RenamedTitleEvent in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<RenamedTitleEvent>("RenamedTitleEvent"),
        oldTitle: {
            type: GraphQLNonNull(GraphQLString),
            description: "The title of the issue before the change"
        },
        newTitle: {
            type: GraphQLNonNull(GraphQLString),
            description: "The new updated title of the issue"
        }
    })
};
const GraphQLRenamedTitleEvent = new GraphQLObjectType(renamedTitleEventConfig);
export default GraphQLRenamedTitleEvent;