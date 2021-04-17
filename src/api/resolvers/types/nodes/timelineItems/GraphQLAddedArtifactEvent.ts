import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { AddedArtifactEvent } from "../../../../../common/nodes/timelineItems/AddedArtifactEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";
import GraphQLArtifact from "../GraphQLArtifact";

const addedArtifactEventConfig: GraphQLObjectTypeConfig<AddedArtifactEvent, ResolverContext> = {
    name: "AddedArtifactEvent",
    description: "An AddedArtifactEvent in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<AddedArtifactEvent>("AddedArtifactEvent"),
        artifact: {
            type: GraphQLArtifact,
            description: "The Artifact which was added to the Issue, null if deleted"
        }
    })
};
const GraphQLAddedArtifactEvent = new GraphQLObjectType(addedArtifactEventConfig);
export default GraphQLAddedArtifactEvent;