import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLComponent from "../../../nodes/GraphQLComponent";
import GraphQLComponentInterface from "../../../nodes/GraphQLComponentInterface";

const addConsumedInterfacePayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "AddConsumedInterfacePayload",
    description: "The Payload/Response for the addComponentToProject mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        component: {
            type: GraphQLComponent,
            description: "The component which consumes the interface"
        },
        interface: {
            type: GraphQLComponentInterface,
            description: "The componentInterface which is consumed by the component"
        }
    })
};
const GraphQLAddConsumedInterfacePayload = new GraphQLObjectType(addConsumedInterfacePayloadConfig);
export default GraphQLAddConsumedInterfacePayload;
