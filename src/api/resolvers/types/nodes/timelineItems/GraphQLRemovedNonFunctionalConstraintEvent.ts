import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { RemovedNonFunctionalConstraintEvent } from "../../../../../common/nodes/timelineItems/RemovedNonFunctionalConstraintEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";
import GraphQLNonFunctionalConstraint from "../GraphQLNonFunctionalConstraint";

const removedNonFunctionalConstraintEventConfig: GraphQLObjectTypeConfig<RemovedNonFunctionalConstraintEvent, ResolverContext> = {
    name: "RemovedNonFunctionalConstraintEvent",
    description: "An RemovedNonFunctionalConstraintEvent in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<RemovedNonFunctionalConstraintEvent>("RemovedNonFunctionalConstraintEvent"),
        removedNonFunctionalConstraint: {
            type: GraphQLNonFunctionalConstraint,
            description: "The NonFunctionalConstraint which was removed from the Issue, null if deleted"
        }
    })
};
const GraphQLRemovedNonFunctionalConstraintEvent = new GraphQLObjectType(removedNonFunctionalConstraintEventConfig);
export default GraphQLRemovedNonFunctionalConstraintEvent;