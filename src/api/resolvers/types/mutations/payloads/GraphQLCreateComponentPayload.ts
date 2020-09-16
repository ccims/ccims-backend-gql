import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLComponent from "../../nodes/GraphQLComponent";

let createComponentPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
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
        }
    })
};
let GraphQLCreateComponentPayload = new GraphQLObjectType(createComponentPayloadConfig);
export default GraphQLCreateComponentPayload;