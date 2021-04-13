import { GraphQLInputObjectTypeConfig, GraphQLNonNull, GraphQLString, GraphQLID, GraphQLInputObjectType } from "graphql";

const deleteProjectInputConfig: GraphQLInputObjectTypeConfig = {
    name: "DeleteProjectInput",
    description: "The inputs for the deleteProject mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        projectId: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the project to delete"
        }
    })
};
const GraphQLDeleteProjectInput = new GraphQLInputObjectType(deleteProjectInputConfig);
export default GraphQLDeleteProjectInput;
