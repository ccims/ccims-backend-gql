import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

const deleteNonFunctionalConstraintPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "DeleteNonFunctionalConstraintPayload",
    description: "The Payload/Response for the deleteNonFunctionalConstraint mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    })
};
const GraphQLDeleteNonFunctionalConstraintPayload = new GraphQLObjectType(deleteNonFunctionalConstraintPayloadConfig);
export default GraphQLDeleteNonFunctionalConstraintPayload;