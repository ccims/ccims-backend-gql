import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";

const deleteLabelPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "DeleteLabelPayload",
    description: "The Payload/Response for the deleteLabel mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    })
};
const GraphQLDeleteLabelPayload = new GraphQLObjectType(deleteLabelPayloadConfig);
export default GraphQLDeleteLabelPayload;