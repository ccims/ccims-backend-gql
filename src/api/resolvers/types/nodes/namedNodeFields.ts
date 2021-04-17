import { GraphQLFieldConfigMap, GraphQLNonNull, GraphQLString } from "graphql";
import { NamedNode } from "../../../../common/nodes/NamedNode";
import { ResolverContext } from "../../../ResolverContext";
import { nodeFields } from "../GraphQLNode";

/**
 * Generates the fields for a NamedNode
 * @param name the name of the NamedNode
 * @param namePlural the plural for of name, defaults to name + "s"
 * @returns the fields config
 */
export function namedNodeFields<T extends NamedNode>(name: string, namePlural: string = name + "s"): GraphQLFieldConfigMap<T, ResolverContext> {
    return {
        ...nodeFields<T>(name, namePlural),
        name: {
            type: GraphQLNonNull(GraphQLString),
            description: `The (non unique) display name of this ${name}\n\nMax. 256 characters`
        },
        description: {
            type: GraphQLNonNull(GraphQLString),
            description: `A textual description (of the function) of this ${name}.\n\nMax. 65536 characters`
        },
    };
}