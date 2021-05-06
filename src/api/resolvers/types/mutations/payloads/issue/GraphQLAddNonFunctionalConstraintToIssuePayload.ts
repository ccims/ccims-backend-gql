import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLNonFunctionalConstraint from "../../../nodes/GraphQLNonFunctionalConstraint";
import GraphQLIssue from "../../../nodes/GraphQLIssue";
import GraphQLIssueTimelineItemEdge from "../../../edges/GraphQLIssueTimelineItemEdge";
import GraphQLAddedNonFunctionalConstraintEvent from "../../../nodes/timelineItems/GraphQLAddedNonFunctionalConstraintEvent";

const addNonFunctionalConstraintToIssuePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "AddNonFunctionalConstraintToIssuePayload",
    description: "The Payload/Response for the addToIssueNonFunctionalConstraint mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        NonFunctionalConstraint: {
            type: GraphQLNonFunctionalConstraint,
            description: "The NonFunctionalConstraint that was added to the issue"
        },
        issue: {
            type: GraphQLIssue,
            description: "The issue to which the specified NonFunctionalConstraint was added"
        },
        event: {
            type: GraphQLAddedNonFunctionalConstraintEvent,
            description: "The issue timeline event for adding the NonFunctionalConstraint to the Issue"
        },
        timelineEdge: {
            type: GraphQLIssueTimelineItemEdge,
            description: "The edge to be able to request other timeline items from this timeline item"
        }
    })
};
const GraphQLAddNonFunctionalConstraintToIssuePayload = new GraphQLObjectType(addNonFunctionalConstraintToIssuePayloadConfig);
export default GraphQLAddNonFunctionalConstraintToIssuePayload;