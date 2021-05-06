import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLIssue from "../../../nodes/GraphQLIssue";
import GraphQLIssueTimelineItemEdge from "../../../edges/GraphQLIssueTimelineItemEdge";
import GraphQLNonFunctionalConstraint from "../../../nodes/GraphQLNonFunctionalConstraint";
import GraphQLRemovedNonFunctionalConstraintEvent from "../../../nodes/timelineItems/GraphQLRemovedNonFunctionalConstraintEvent";

const removeNonFunctionalConstraintFromIssuePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "RemoveNonFunctionalConstraintFromIssuePayload",
    description: "The Payload/Response for the removeFromIssueNonFunctionalConstraint mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        nonFunctionalConstraint: {
            type: GraphQLNonFunctionalConstraint,
            description: "The NonFunctionalConstraint that was removed from the issue"
        },
        issue: {
            type: GraphQLIssue,
            description: "The issue from which the NonFunctionalConstraint was removed"
        },
        event: {
            type: GraphQLRemovedNonFunctionalConstraintEvent,
            description: "The issue timeline event for the removal of the NonFunctionalConstraint from the issue"
        },
        timelineEdge: {
            type: GraphQLIssueTimelineItemEdge,
            description: "The edge to be able to request other timeline items from this timeline item"
        }
    })
};
const GraphQLRemoveNonFunctionalConstraintFromIssuePayload = new GraphQLObjectType(removeNonFunctionalConstraintFromIssuePayloadConfig);
export default GraphQLRemoveNonFunctionalConstraintFromIssuePayload;