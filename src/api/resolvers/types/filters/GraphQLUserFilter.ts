import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLString, GraphQLID, GraphQLInputObjectTypeConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";

let userFilterConfig: GraphQLInputObjectTypeConfig = {
    name: "UserFilter",
    description: "Filter for a user of the system. All parameters given in this filter will be connected via _AND_",
    fields: () => ({
        username: {
            type: GraphQLString,
            description: "The users username must match this given RegEx"
        },
        displayName: {
            type: GraphQLString,
            description: "The users display name must match this given RegEx"
        },
        email: {
            type: GraphQLString,
            description: "The users email must match this given RegEx"
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
    })
};
let GraphQLUserFilter = new GraphQLInputObjectType(userFilterConfig);
export default GraphQLUserFilter;