import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLComponentInterface from "../../../nodes/GraphQLComponentInterface";

const updateComponentInterfacePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "UpdateComponentInterfacePayload",
    description: "The Payload/Response for the updateComponentInterface mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        componentInterface: {
            type: GraphQLComponentInterface,
            description: "The componentInterface updated by this mutation"
        }
    })
};
const GraphQLUpdateComponentInterfacePayload = new GraphQLObjectType(updateComponentInterfacePayloadConfig);
export default GraphQLUpdateComponentInterfacePayload;