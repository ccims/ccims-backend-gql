import { GraphQLObjectType, GraphQLID, GraphQLNonNull, GraphQLString, GraphQLInt } from "graphql";

export default new GraphQLObjectType({
    name: "Project",
    description: "A project is a one unit in which the participating components colaborate",
    fields: {
        id: {
            type: GraphQLNonNull(GraphQLID),
            description: "The unique id of this project"
        },
        name: {
            type: GraphQLNonNull(GraphQLString),
            description: "The human readable name of this project"
        },
        components: {
            type: GraphQLComponentPage,
            description: "Components which are part of this project and match the filter.\n\nIf no filter is given, all components will be returned",
            args: {
                after: {
                    type: GraphQLString,
                    description: "Return only components AFTER the one with the specified cursor (exclusive)"
                },
                before: {
                    type: GraphQLString,
                    description: "Return only components BEFORE the one with the specified cursor (exclusive)"
                },
                filterBy: {
                    type: GraphQLComponentFilter,
                    description: "Return only components matching this filter"
                },
                first: {
                    type: GraphQLInt,
                    description: "Return at most the first n components"
                },
                last: {
                    type: GraphQLInt,
                    description: "Return at most the last n components"
                }
            }
        },
        users: {
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
        },
        owner: {
            type: GraphQLNonNull(GraphQLUser),
            description: "The user which administrates \"owns\" the project"
        },
        issues: {
            type: GraphQLIssuePage,
            description: `All issues in this project, matching the given filter.\n
            These are all issues regardless on which components/interfaces they are located.\n\n
            If no filter is given, all issues will be returned`,
            args: {
                after: {
                    type: GraphQLString,
                    description: "Return only issues AFTER the one with the specified cursor (exclusive)"
                },
                before: {
                    type: GraphQLString,
                    description: "Return only issues BEFORE the one with the specified cursor (exclusive)"
                },
                filterBy: {
                    type: GraphQLIssueFilter,
                    description: "Return only issues matching this filter"
                },
                first: {
                    type: GraphQLInt,
                    description: "Return at most the first n issues"
                },
                last: {
                    type: GraphQLInt,
                    description: "Return at most the last n issues"
                }
            }
        }
    }
});