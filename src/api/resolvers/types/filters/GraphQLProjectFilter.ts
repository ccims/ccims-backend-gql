import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLString, GraphQLID, GraphQLInputObjectTypeConfig } from "graphql";

let projectFilterConfig: GraphQLInputObjectTypeConfig = {
    name: "ProjectFilter",
    description: "Filter for a Project. All parameters given in this filter will be connected via _AND_",
    fields: () => ({
        name: {
            type: GraphQLString,
            description: "The name of the project must match the given RegEx"
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
        },
        description: {
            type: GraphQLString,
            description: "The projects description must match the given __RegEx__"
        }
    })
};
let GraphQLProjectFilter = new GraphQLInputObjectType(projectFilterConfig);
export default GraphQLProjectFilter;