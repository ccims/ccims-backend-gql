import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLString, GraphQLID, GraphQLInputObjectTypeConfig, GraphQLInputFieldConfigMap } from "graphql";
import { User } from "../../../../common/nodes/User";

/**
 * Generates the fields for a User filter
 * @param name the name of the User
 * @param namePlural the plural for of name, defaults to name + "s"
 * @returns the fields config
 */
 export function userFilterFields<T extends User>(name: string, namePlural: string = name + "s"): GraphQLInputFieldConfigMap {
    return {
        username: {
            type: GraphQLString,
            description: `The ${name}'s username must match this given RegEx`
        },
        displayName: {
            type: GraphQLString,
            description: `The ${name}'s display name must match this given RegEx`
        },
        email: {
            type: GraphQLString,
            description: `The ${name}'s email must match this given RegEx`
        },
        assignedToIssues: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: `The ${name} must be assigned to at least one of the issues with the given ids`
        },
        participantOfIssues: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: `The ${name} must be participant of at least one of the issues with the given ids`
        },
        comments: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: `The ${name} must have written or edited at least one of the comments (issue or comment) with the given ids`
        }
    };
}

const userFilterConfig: GraphQLInputObjectTypeConfig = {
    name: "UserFilter",
    description: "Filter for a user of the system. All parameters given in this filter will be connected via _AND_",
    fields: () => userFilterFields<User>("User")
};
const GraphQLUserFilter = new GraphQLInputObjectType(userFilterConfig);
export default GraphQLUserFilter;