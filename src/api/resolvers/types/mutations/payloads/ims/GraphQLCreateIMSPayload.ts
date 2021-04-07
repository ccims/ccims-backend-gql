import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLIMS from "../../../nodes/GraphQLIMS";

const createIMSPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "CreateIMSPayload",
    description: "The Payload/Response for the createIMS mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        ims: {
            type: GraphQLIMS,
            description: "The IMS created by this mutation"
        }
    })
};
const GraphQLCreateIMSPayload = new GraphQLObjectType(createIMSPayloadConfig);
export default GraphQLCreateIMSPayload;