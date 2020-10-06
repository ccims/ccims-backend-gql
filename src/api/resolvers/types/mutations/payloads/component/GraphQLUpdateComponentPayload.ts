import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLComponent from "../../../nodes/GraphQLComponent";
import GraphQLIMS from "../../../nodes/GraphQLIMS";

const updateComponentPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "UpdateComponentPayload",
    description: "The Payload/Response for the updateComponent mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        component: {
            type: GraphQLComponent,
            description: "The component updated by this mutation"
        },
        ims: {
            type: GraphQLIMS,
            description: "The IMS of the component updated by this mutation"
        }
    })
};
const GraphQLUpdateComponentPayload = new GraphQLObjectType(updateComponentPayloadConfig);
export default GraphQLUpdateComponentPayload;