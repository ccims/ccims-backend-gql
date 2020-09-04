import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLString, GraphQLID } from "graphql";

export default new GraphQLInputObjectType({
    name: "UserFilter",
    description: "Filter for a user of the system. All parameters given in this filter will be connected via _AND_",
    fields: {
        username: {
            type: GraphQLList(GraphQLNonNull(GraphQLString)),
            description: "Any of the strings must match the users username"
        },
        displayName: {
            type: GraphQLString,
            description: "The users username must match this given __RegEx__"
        },
        email: {
            type: GraphQLList(GraphQLNonNull(GraphQLString)),
            description: "The mail address of the user must match any of the ones given"
        },
        projects: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "The user must be member of at least one of the projects with the given ids"
        },
        assignedToIssues: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "The user must be assigned to at least one of the issues with the given ids"
        },
        participantOfIssues: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "The user must be participant of at least one of the issues with the given ids"
        },
        issueComments: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "The user must have written at least one of the comments with the given ids"
        }
    }
});