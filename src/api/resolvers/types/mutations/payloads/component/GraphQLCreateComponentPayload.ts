import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLComponent from "../../../nodes/GraphQLComponent";
import GraphQLIMS from "../../../nodes/GraphQLIMS";

const createComponentPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "CreateComponentPayload",
    description: "The Payload/Response for the createComponent mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        component: {
            type: GraphQLComponent,
            description: "The component created by this mutation"
        },
        ims: {
            type: GraphQLIMS,
            description: "The IMS of the component created by this mutation"
        }
    })
};
const GraphQLCreateComponentPayload = new GraphQLObjectType(createComponentPayloadConfig);
export default GraphQLCreateComponentPayload;