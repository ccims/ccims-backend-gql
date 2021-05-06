import { GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLNonFunctionalConstraint from "../../../nodes/GraphQLNonFunctionalConstraint";
import GraphQLAddedNonFunctionalConstraintEvent from "../../../nodes/timelineItems/GraphQLAddedNonFunctionalConstraintEvent";

const createNonFunctionalConstraintPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "CreateNonFunctionalConstraintPayload",
    description: "The Payload/Response for the createNonFunctionalConstraint mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        nonFunctionalConstraint: {
            type: GraphQLNonFunctionalConstraint,
            description: "The NonFunctionalConstraint created by this mutation"
        },
        addedEvent: {
            type: GraphQLAddedNonFunctionalConstraintEvent,
            description: "The event for adding the NonFunctionalConstraint to the Issue"
        }
    })
};
const GraphQLCreateNonFunctionalConstraintPayload = new GraphQLObjectType(createNonFunctionalConstraintPayloadConfig);
export default GraphQLCreateNonFunctionalConstraintPayload;