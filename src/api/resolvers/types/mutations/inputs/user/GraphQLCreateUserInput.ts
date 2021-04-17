import { GraphQLInputObjectTypeConfig, GraphQLNonNull, GraphQLString, GraphQLInputObjectType } from "graphql";

const createUserInputConfig: GraphQLInputObjectTypeConfig = {
    name: "CreateUserInput",
    description: "The inputs for the createUser mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        username: {
            type: GraphQLNonNull(GraphQLString),
            description: "The unique username used for login.\n\nMax. 100 characters."
        },
        displayName: {
            type: GraphQLNonNull(GraphQLString),
            description: "The name of the user to display in the GUI.\n\nMax. 200 characters."
        },
        password: {
            type: GraphQLNonNull(GraphQLString),
            description: "The password for the new user in plain text"
        },
        email: {
            type: GraphQLString,
            description: "The mail address of the user.\n\nMax. 320 characters. Must be a valid email address"
        }
    })
};
const GraphQLCreateUserInput = new GraphQLInputObjectType(createUserInputConfig);
export default GraphQLCreateUserInput;
