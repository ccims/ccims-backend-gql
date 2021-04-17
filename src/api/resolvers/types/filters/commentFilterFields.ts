import { GraphQLBoolean, GraphQLID, GraphQLInputFieldConfigMap, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import { Comment } from "../../../../common/nodes/Comment";
import GraphQLDate from "../../scalars/GraphQLDate";
import { syncNodeFilterFields } from "./syncNodeFilterFields";

/**
 * Generates the fields for a Comment filter
 * @param name the name of the Comment
 * @param namePlural the plural for of name, defaults to name + "s"
 * @returns the fields config
 */
 export function commentFilterFields<T extends Comment>(name: string, namePlural: string = name + "s"): GraphQLInputFieldConfigMap {
    return {
        ...syncNodeFilterFields<T>(name, namePlural),
        editedBy: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: `The id of the user who __last__ edited the ${name} must match any of the given ids`
        },
        lastEditedAfter: {
            type: GraphQLDate,
            description: `Match all ${namePlural} last edited after the given date (inclusive)`
        },
        lastEditedBefore: {
            type: GraphQLDate,
            description: `Match all ${namePlural} last edited before the given date (inclusive)`
        },
        body: {
            type: GraphQLString,
            description: `The body of a ${name} must match this __RegEx__ to match the filter`
        },
        reactions: {
            type: GraphQLList(GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLString)))),
            description: `A ${name} must have all the reactions in one of the lists given.`
        },
        currentUserCanEdit: {
            type: GraphQLBoolean,
            description: `If given, filters for ${namePlural} which the user either has or hasn't got edit permissions`
        }
    };
}