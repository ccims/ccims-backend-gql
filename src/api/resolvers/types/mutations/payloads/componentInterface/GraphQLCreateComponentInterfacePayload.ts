import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLComponentInterface from "../../../nodes/GraphQLComponentInterface";

const createComponentInterfacePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "CreateComponentInterfacePayload",
    description: "The Payload/Response for the createComponentInterface mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        componentInterface: {
            type: GraphQLComponentInterface,
            description: "The componentInterface created by this mutation"
        }
    })
};
const GraphQLCreateComponentInterfacePayload = new GraphQLObjectType(createComponentInterfacePayloadConfig);
export default GraphQLCreateComponentInterfacePayload;