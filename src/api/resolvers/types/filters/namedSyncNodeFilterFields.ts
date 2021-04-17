import { GraphQLString, GraphQLInputFieldConfigMap } from "graphql";
import { NamedSyncNode } from "../../../../common/nodes/NamedSyncNode";
import GraphQLDate from "../../scalars/GraphQLDate";
import { syncNodeFilterFields } from "./syncNodeFilterFields";

/**
 * Generates the fields for a NamedSyncNode filter
 * @param name the name of the NamedSyncNode
 * @param namePlural the plural for of name, defaults to name + "s"
 * @returns the fields config
 */
export function namedSyncNodeFilterFields<T extends NamedSyncNode>(name: string, namePlural: string = name + "s"): GraphQLInputFieldConfigMap {
    return {
        ...syncNodeFilterFields<T>(name, namePlural),
        name: {
            type: GraphQLString,
            description: `The name of the ${name} must match the given RegEx`
        },
        description: {
            type: GraphQLString,
            description: `The __RegEx__ the description of the ${name} needs to match`
        },
        lastUpdatedAfter: {
            type: GraphQLDate,
            description: `The last update to this ${name} must have occurred __after__ the given date (inclusive)`
        },
        lastUpdatedBefore: {
            type: GraphQLDate,
            description: `The last update to this ${name} must have occurred __before__ the given date (inclusive)`
        }
    };
}
