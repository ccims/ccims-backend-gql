import { GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLList, GraphQLID } from "graphql";

const createProjectInputConfig: GraphQLInputObjectTypeConfig = {
    name: "CreateProjectInput",
    description: "The inputs for the createProject mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        name: {
            type: GraphQLNonNull(GraphQLString),
            description: "The name of the project\n\nMax. 256 characters"
        },
        description: {
            type: GraphQLString,
            description: "The description of the project\n\nMax. 65536 characters"
        },
        components: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "The list of components for the project to be initialized with.\n\nIf `null`, the peoject will contain no components (However, they can be added later)"
        }
    })
};
const GraphQLCreateProjectInput = new GraphQLInputObjectType(createProjectInputConfig);
export default GraphQLCreateProjectInput;