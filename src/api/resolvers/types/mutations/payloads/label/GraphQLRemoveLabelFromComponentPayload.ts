import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLComponent from "../../../nodes/GraphQLComponent";
import GraphQLLabel from "../../../nodes/GraphQLLabel";

const removeLabelFromComponentPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "RemoveLabelFromComponentPayload",
    description: "The Payload/Response for the removeComponentFromProject mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        component: {
            type: GraphQLComponent,
            description: "The component which from which the label is removeed"
        },
        label: {
            type: GraphQLLabel,
            description: "The Label which is removed from the Component"
        }
    })
};
const GraphQLRemoveLabelFromComponentPayload = new GraphQLObjectType(removeLabelFromComponentPayloadConfig);
export default GraphQLRemoveLabelFromComponentPayload;
