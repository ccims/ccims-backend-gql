import { GraphQLString, GraphQLInputFieldConfigMap } from "graphql";
import { NamedNode } from "../../../../common/nodes/NamedNode";

/**
 * Generates the fields for a NamedNode filter
 * @param name the name of the NamedNode
 * @param namePlural the plural for of name, defaults to name + "s"
 * @returns the fields config
 */
export function namedNodeFilterFields<T extends NamedNode>(name: string, namePlural: string = name + "s"): GraphQLInputFieldConfigMap {
    return {
        name: {
            type: GraphQLString,
            description: `The name of the ${name} must match the given RegEx`
        },
        description: {
            type: GraphQLString,
            description: `The __RegEx__ the description of the ${name} needs to match`
        }
    };
}
