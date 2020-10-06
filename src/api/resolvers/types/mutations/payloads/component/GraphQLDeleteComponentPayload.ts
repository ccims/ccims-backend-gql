import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

const deleteComponentPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "DeleteComponentPayload",
    description: "The Payload/Response for the deleteComponent mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    })
};
const GraphQLDeleteComponentPayload = new GraphQLObjectType(deleteComponentPayloadConfig);
export default GraphQLDeleteComponentPayload;