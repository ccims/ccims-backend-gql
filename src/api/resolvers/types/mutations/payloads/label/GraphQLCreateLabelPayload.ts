import { GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLLabel from "../../../nodes/GraphQLLabel";

const createLabelPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "CreateLabelPayload",
    description: "The Payload/Response for the createLabel mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        label: {
            type: GraphQLLabel,
            description: "The label created by this mutation"
        }
    })
};
const GraphQLCreateLabelPayload = new GraphQLObjectType(createLabelPayloadConfig);
export default GraphQLCreateLabelPayload;