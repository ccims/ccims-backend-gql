import { GraphQLInputObjectTypeConfig, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID, GraphQLInputObjectType } from "graphql";

const registerUserInputConfig: GraphQLInputObjectTypeConfig = {
    name: "RegisterUserInput",
    description: "The inputs for the registerUser mutation",
    fields: () => ({
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
const GraphQLRegisterUserInput = new GraphQLInputObjectType(registerUserInputConfig);
export default GraphQLRegisterUserInput;
