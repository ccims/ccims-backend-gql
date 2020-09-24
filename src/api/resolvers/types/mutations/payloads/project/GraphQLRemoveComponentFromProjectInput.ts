import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString, GraphQLNonNull } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLComponent from "../../../nodes/GraphQLComponent";
import GraphQLProject from "../../../nodes/GraphQLProject";

const removeComponentFromProjectPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "RemoveComponentFromProjectPayload",
    description: "The Payload/Response for the removeComponentFromProject mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        project: {
            type: GraphQLNonNull(GraphQLProject),
            description: "The project where the component was removed"
        },
        component: {
            type: GraphQLNonNull(GraphQLComponent),
            description: "The component which was removed from the project"
        }
    })
};
const GraphQLRemoveComponentFromProjectPayload = new GraphQLObjectType(removeComponentFromProjectPayloadConfig);
export default GraphQLRemoveComponentFromProjectPayload;