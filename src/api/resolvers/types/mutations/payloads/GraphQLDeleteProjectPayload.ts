import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../ResolverContext";

const deleteProjectPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "DeleteProjectPayload",
    description: "The Payload/Response for the deleteProject mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        }
    })
};
const GraphQLDeleteProjectPayload = new GraphQLObjectType(deleteProjectPayloadConfig);
export default GraphQLDeleteProjectPayload;