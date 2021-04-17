import { GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

const updateProjectInputConfig: GraphQLInputObjectTypeConfig = {
    name: "UpdateProjectInput",
    description: "The inputs for the updateProject mutation, updates only the provided fields",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        project: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the project to update"
        },
        name: {
            type: GraphQLString,
            description: "The name of the project\n\nMax. 256 characters"
        },
        description: {
            type: GraphQLString,
            description: "The description of the project\n\nMax. 65536 characters"
        }
    })
};
const GraphQLUpdateProjectInput = new GraphQLInputObjectType(updateProjectInputConfig);
export default GraphQLUpdateProjectInput;