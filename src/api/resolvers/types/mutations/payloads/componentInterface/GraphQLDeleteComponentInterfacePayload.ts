import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

const deleteComponentInterfacePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "DeleteComponentInterfacePayload",
    description: "The Payload/Response for the deleteComponentInterface mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    })
};
const GraphQLDeleteComponentInterfacePayload = new GraphQLObjectType(deleteComponentInterfacePayloadConfig);
export default GraphQLDeleteComponentInterfacePayload;