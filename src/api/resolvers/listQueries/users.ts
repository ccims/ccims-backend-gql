import { GraphQLFieldConfig, GraphQLString, GraphQLInt } from "graphql";

let users: GraphQLFieldConfig<any, any, any> = {
    type: GraphQLUserPage,
    description: "Users which are part of this project and match the given filter.\n\nIf no filter is given, all users will be returned",
    args: {
        after: {
            type: GraphQLString,
            description: "Return only users AFTER the one with the specified cursor (exclusive)"
        },
        before: {
            type: GraphQLString,
            description: "Return only users BEFORE the one with the specified cursor (exclusive)"
        },
        filterBy: {
            type: GraphQLUserFilter,
            description: "Return only users matching this filter"
        },
        first: {
            type: GraphQLInt,
            description: "Return at most the first n users"
        },
        last: {
            type: GraphQLInt,
            description: "Return at most the last n users"
        }
    }
};
export default users;