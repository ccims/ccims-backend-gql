import { GraphQLInputObjectTypeConfig, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID, GraphQLInputObjectType } from "graphql";

let createUserInputConfig: GraphQLInputObjectTypeConfig = {
    name: "CreateUserInput",
    description: "The inputs for the createUser mutation",
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
            type: GraphQLNonNull(GraphQLString),
            description: "The mail address of the user.\n\nMax. 320 characters. Must be a valid email address"
        },
        projects: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "If given, the user will be added to the projects with those IDs immediately after creation"
        }
    })
};
let GraphQLCreateUserInputConfig = new GraphQLInputObjectType(createUserInputConfig);
export default GraphQLCreateUserInputConfig;