import { GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLNonFunctionalConstraint from "../../../nodes/GraphQLNonFunctionalConstraint";

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
        }
    })
};
const GraphQLCreateNonFunctionalConstraintPayload = new GraphQLObjectType(createNonFunctionalConstraintPayloadConfig);
export default GraphQLCreateNonFunctionalConstraintPayload;