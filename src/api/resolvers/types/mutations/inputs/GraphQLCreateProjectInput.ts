import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLList, GraphQLID } from "graphql";

let createProjectInputConfig: GraphQLInputObjectTypeConfig = {
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
        },
        users: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "The users which will initially be part of the project.\nThe owner will always be added.\n\nIf `null`, only the owner will be added to the project"
        },
        owner: {
            type: GraphQLNonNull(GraphQLID),
            description: "The owner user of this component. This user will be able to administrate the component"
        }
    })
};
let GraphQLCreateProjectInput = new GraphQLInputObjectType(createProjectInputConfig);
export default GraphQLCreateProjectInput;