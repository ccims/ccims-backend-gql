import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLComponent from "../../../nodes/GraphQLComponent";
import GraphQLComponentInterface from "../../../nodes/GraphQLComponentInterface";

const removeConsumedInterfacePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "RemoveConsumedInterfacePayload",
    description: "The Payload/Response for the removeComponentFromProject mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        component: {
            type: GraphQLComponent,
            description: "The component which consumed the interface"
        },
        interface: {
            type: GraphQLComponentInterface,
            description: "The componentInterface which was consumed by the component"
        }
    })
};
const GraphQLRemoveConsumedInterfacePayload = new GraphQLObjectType(removeConsumedInterfacePayloadConfig);
export default GraphQLRemoveConsumedInterfacePayload;
