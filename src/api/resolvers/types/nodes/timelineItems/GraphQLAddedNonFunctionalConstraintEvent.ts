import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { AddedNonFunctionalConstraintEvent } from "../../../../../common/nodes/timelineItems/AddedNonFunctionalConstraintEvent";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLNode from "../../GraphQLNode";
import GraphQLIssueTimelineItem, { issueTimelineItemFields } from "../GraphQLIssueTimelineItem";
import GraphQLNonFunctionalConstraint from "../GraphQLNonFunctionalConstraint";

const addedNonFunctionalConstraintEventConfig: GraphQLObjectTypeConfig<AddedNonFunctionalConstraintEvent, ResolverContext> = {
    name: "AddedNonFunctionalConstraintEvent",
    description: "An AddedNonFunctionalConstraintEvent in the timeline of an issue with a date and a creator",
    interfaces: () => ([GraphQLIssueTimelineItem, GraphQLNode]),
    fields: () => ({
        ...issueTimelineItemFields<AddedNonFunctionalConstraintEvent>("AddedNonFunctionalConstraintEvent"),
        nonFunctionalConstraint: {
            type: GraphQLNonFunctionalConstraint,
            description: "The NonFunctionalConstraint which was added to the Issue, null if deleted"
        }
    })
};
const GraphQLAddedNonFunctionalConstraintEvent = new GraphQLObjectType(addedNonFunctionalConstraintEventConfig);
export default GraphQLAddedNonFunctionalConstraintEvent;