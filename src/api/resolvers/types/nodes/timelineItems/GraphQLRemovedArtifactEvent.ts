import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { RemovedArtifactEvent } from "../../../../../common/nodes/timelineItems/RemovedArtifactEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";
import GraphQLArtifact from "../GraphQLArtifact";

const removedArtifactEventConfig: GraphQLObjectTypeConfig<RemovedArtifactEvent, ResolverContext> = {
    name: "RemovedArtifactEvent",
    description: "An RemovedArtifactEvent in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<RemovedArtifactEvent>("RemovedArtifactEvent"),
        removedArtifact: {
            type: GraphQLArtifact,
            description: "The Artifact which was removed from the Issue, null if deleted"
        }
    })
};
const GraphQLRemovedArtifactEvent = new GraphQLObjectType(removedArtifactEventConfig);
export default GraphQLRemovedArtifactEvent;