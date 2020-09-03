import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLString, GraphQLID } from "graphql";

export default new GraphQLInputObjectType({
    name: "ProjectFilter",
    description: "Filter for a Project. All parameters given in this filter will be connected via _AND_",
    fields: {
        name: {
            type: GraphQLList(GraphQLNonNull(GraphQLString)),
            description: "The name of the project must match any of the given strings"
        },
        components: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "The project must have any of the components with the given ids"
        },
        users: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "At least one of the users with the given ids must be part of the project"
        },
        owner: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "The Owner of the project must be a user with one of the given ids"
        },
        issues: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "At least one of the issues given must be on a component assigned to the project"
        }
    }
});