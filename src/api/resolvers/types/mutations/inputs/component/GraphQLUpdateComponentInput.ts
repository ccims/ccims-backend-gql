import { GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";

const updateComponentInputConfig: GraphQLInputObjectTypeConfig = {
    name: "UpdateComponentInput",
    description: "The inputs for the updateComponent mutation, updates only the provided fields",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        component: {
            type: GraphQLNonNull(GraphQLID),
            description: "The id of the component to update"
        },
        name: {
            type: GraphQLString,
            description: "The (non unique) display name of this component\n\nMax. 256 characters"
        },
        description: {
            type: GraphQLString,
            description: "A textual description (of the function) of this component.\n\nMax. 65536 characters."
        },
        repositoryURL: {
            type: GraphQLString,
            description: "The URL where the code repository of this component is located\n\nMax. 65536 characters"
        }
    })
};
const GraphQLUpdateComponentInput = new GraphQLInputObjectType(updateComponentInputConfig);
export default GraphQLUpdateComponentInput;