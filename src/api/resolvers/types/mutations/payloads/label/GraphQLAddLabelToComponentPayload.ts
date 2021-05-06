import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLComponent from "../../../nodes/GraphQLComponent";
import GraphQLLabel from "../../../nodes/GraphQLLabel";

const addLabelToComponentPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "AddLabelToComponentPayload",
    description: "The Payload/Response for the addComponentToProject mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        component: {
            type: GraphQLComponent,
            description: "The component which to which the label is added"
        },
        label: {
            type: GraphQLLabel,
            description: "The Label which is added to the Component"
        }
    })
};
const GraphQLAddLabelToComponentPayload = new GraphQLObjectType(addLabelToComponentPayloadConfig);
export default GraphQLAddLabelToComponentPayload;
