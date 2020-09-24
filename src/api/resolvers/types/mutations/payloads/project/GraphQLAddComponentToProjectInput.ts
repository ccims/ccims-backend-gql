import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLComponent from "../../../nodes/GraphQLComponent";
import GraphQLProject from "../../../nodes/GraphQLProject";

const addComponentToProjectPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "AddComponentToProjectPayload",
    description: "The Payload/Response for the addComponentToProject mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        project: {
            type: GraphQLProject,
            description: "The project where the component was added"
        },
        component: {
            type: GraphQLComponent,
            description: "The component which was added to the project"
        },
        componentCursor: {
            type: GraphQLString,
            description: "The component's cursor in project's components page"
        }
    })
};
const GraphQLAddComponentToProjectPayload = new GraphQLObjectType(addComponentToProjectPayloadConfig);
export default GraphQLAddComponentToProjectPayload;