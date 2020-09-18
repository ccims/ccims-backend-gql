import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../ResolverContext";
import GraphQLProject from "../../nodes/GraphQLProject";

const createProjectPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "CreateProjectPayload",
    description: "The Payload/Response for the createProject mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        project: {
            type: GraphQLProject,
            description: "The project created by this mutation"
        }
    })
};
const GraphQLCreateProjectPayload = new GraphQLObjectType(createProjectPayloadConfig);
export default GraphQLCreateProjectPayload;