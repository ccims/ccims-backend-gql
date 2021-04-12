import { GraphQLObjectType, GraphQLInterfaceType, GraphQLObjectTypeConfig, GraphQLNonNull, GraphQLString } from "graphql";
import { ResolverContext } from "../../../ResolverContext";

/**
 * Createsx the config for a GraphQLEdge
 * The name for the config is name + "Edge"
 * @param nodeTypeProvider provider for the GraphQL type for the Node
 * @param name the name of the node
 * @param namePlural the plural of name, defaults to name + "s"
 */
export function createEdge(
    nodeTypeProvider: () => GraphQLObjectType<any, ResolverContext> | GraphQLInterfaceType, 
    name: string, namePlural: string = name + "s"): GraphQLObjectTypeConfig<any, ResolverContext> {
    return {
        name: `${name}Edge`,
        description: `An edge for a ${name}Page to link a cursor to an element`,
        fields: () => ({
            node: {
                type: nodeTypeProvider(),
                description: `The ${name} linked to by this edge`
            },
            cursor: {
                type: GraphQLNonNull(GraphQLString),
                description: "The cursor for use in the pagination"
            }
        })
    };
}