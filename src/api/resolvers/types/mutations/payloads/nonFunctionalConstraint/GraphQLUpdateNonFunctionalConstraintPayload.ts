import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLNonFunctionalConstraint from "../../../nodes/GraphQLNonFunctionalConstraint";

const updateNonFunctionalConstraintPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "UpdateNonFunctionalConstraintPayload",
    description: "The Payload/Response for the updateNonFunctionalConstraint mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        NonFunctionalConstraint: {
            type: GraphQLNonFunctionalConstraint,
            description: "The NonFunctionalConstraint updated by this mutation"
        }
    })
};
const GraphQLUpdateNonFunctionalConstraintPayload = new GraphQLObjectType(updateNonFunctionalConstraintPayloadConfig);
export default GraphQLUpdateNonFunctionalConstraintPayload;