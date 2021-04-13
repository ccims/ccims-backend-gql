import { GraphQLFieldConfigMap, GraphQLID, GraphQLInputFieldConfigMap, GraphQLList, GraphQLNonNull } from "graphql";
import { SyncNode } from "../../../../common/nodes/SyncNode";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLDate from "../../scalars/GraphQLDate";

/**
 * Generates the fields for a SyncNode filter
 * @param name the name of the node
 * @param namePlural the plural for of name, defaults to name + "s"
 * @returns the fields config
 */
export function syncNodeFilterFields<T extends SyncNode>(name: string, namePlural: string = name + "s"): GraphQLInputFieldConfigMap {
    return {
        createdBy: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: `The id of the ${name} creating the issue must be any of the given ones`
        },
        createdAfter: {
            type: GraphQLDate,
            description: `The ${name} must have been created __after__ the given date (inclusive)`
        },
        createdBefore: {
            type: GraphQLDate,
            description: `The ${name} must have been created __before__ the given date (inclusive)`
        }
    };
}