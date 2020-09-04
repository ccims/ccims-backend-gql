import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString } from "graphql";

export default new GraphQLInputObjectType({
    name: "ReactionGroupFilter",
    description: "A filter for reaction groups (a reaction together with the users who reacted). All parameters given in this filter will be connected via _AND_",
    fields: {
        reaction: {
            type: GraphQLList(GraphQLNonNull(GraphQLString)),
            description: "The reactions name must match any one or more of the given strings"
        },
        users: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "A list of Users who reacted. Any reaction group which contains at least one of the given users will match the filter"
        }
    }
});