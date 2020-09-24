import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLProject from "../../nodes/GraphQLProject";

const updateProjectPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "UpdateProjectPayload",
    description: "The Payload/Response for the updateProject mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        project: {
            type: GraphQLProject,
            description: "The project updated by this mutation"
        }
    })
};
const GraphQLUpdateProjectPayload = new GraphQLObjectType(updateProjectPayloadConfig);
export default GraphQLUpdateProjectPayload;