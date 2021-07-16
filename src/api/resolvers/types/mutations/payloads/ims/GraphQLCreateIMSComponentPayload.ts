import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLIMSComponent from "../../../nodes/GraphQLIMSComponent";

const createIMSComponentPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "CreateIMSComponentPayload",
    description: "The Payload/Response for the createIMS mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        imsComponent: {
            type: GraphQLIMSComponent,
            description: "The IMSComponent created by this mutation"
        }
    })
};
const GraphQLCreateIMSComponentPayload = new GraphQLObjectType(createIMSComponentPayloadConfig);
export default GraphQLCreateIMSComponentPayload;