import { GraphQLFieldConfigMap, GraphQLNonNull, GraphQLString } from "graphql";
import { NamedSyncNode } from "../../../../common/nodes/NamedSyncNode";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLDate from "../../scalars/GraphQLDate";
import { syncNodeFields } from "./syncNodeFields";

/**
 * Generates the fields for a NamedSyncNode
 * @param name the name of the NamedSyncNode
 * @param namePlural the plural for of name, defaults to name + "s"
 * @returns the fields config
 */
export function namedSyncNodeFields<T extends NamedSyncNode>(name: string, namePlural: string = name + "s"): GraphQLFieldConfigMap<T, ResolverContext> {
    return {
        ...syncNodeFields<T>(name, namePlural),
        name: {
            type: GraphQLNonNull(GraphQLString),
            description: `The (non unique) display name of this ${name}\n\nMax. 256 characters`
        },
        description: {
            type: GraphQLNonNull(GraphQLString),
            description: `A textual description (of the function) of this ${name}.\n\nMax. 65536 characters`
        },
        lastUpdatedAt: {
            type: GraphQLDate,
            description: `Date when the name, description or any other field directly on ${name} was last updated`
        }
    };
}