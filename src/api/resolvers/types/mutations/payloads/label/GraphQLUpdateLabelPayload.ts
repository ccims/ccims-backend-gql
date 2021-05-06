import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLLabel from "../../../nodes/GraphQLLabel";

const updateLabelPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "UpdateLabelPayload",
    description: "The Payload/Response for the updateLabel mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        Label: {
            type: GraphQLLabel,
            description: "The Label updated by this mutation"
        }
    })
};
const GraphQLUpdateLabelPayload = new GraphQLObjectType(updateLabelPayloadConfig);
export default GraphQLUpdateLabelPayload;