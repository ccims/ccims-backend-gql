import { GraphQLInt, GraphQLInterfaceType, GraphQLInterfaceTypeConfig, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLPageInfo from "./GraphQLPageInfo";

/**
 * Creates the config for a GraphQLPage
 * The name for the config is name + "Page"
 * @param nodeTypeProvider The GraphQL type for the Node
 * @param edgeTypeProvier The GraphQL typo for the Edge
 * @param name the name of the node
 * @param namePlural the plural of name, defaults to name + "s"
 * @returns a GraphQLObjectTypeConfig for the Page
 */
export function createPageConfig(
        nodeTypeProvider: () => GraphQLObjectType<any, ResolverContext> | GraphQLInterfaceType, 
        edgeTypeProvider: () => GraphQLObjectType<any, ResolverContext>, 
        name: string, namePlural: string = name + "s"): GraphQLObjectTypeConfig<any, ResolverContext> {
    return {
        name: `${name}Page`,
        description: `A page of multiple ${namePlural}`,
        interfaces: () => ([GraphQLPage]),
        fields: () => ({
            nodes: {
                type: GraphQLList(nodeTypeProvider()),
                description: `All ${namePlural} on this page`
            },
            edges: {
                type: GraphQLList(edgeTypeProvider()),
                description: `Edges to all ${namePlural} containing the cursor`
            },
            pageInfo: {
                type: GraphQLNonNull(GraphQLPageInfo),
                description: "Information about the current page (like length, first/last element)"
            },
            totalCount: {
                type: GraphQLNonNull(GraphQLInt),
                description: "The total number of elements matching the filter\n\n(Even ones that don't match the current page)"
            }
        })
    };
}

const pageConfig: GraphQLInterfaceTypeConfig<any, ResolverContext> = {
    name: "Page",
    description: "A page of elements\n\nContains edges and nodes as well as some information and a node count",
    fields: () => ({
        pageInfo: {
            type: GraphQLNonNull(GraphQLPageInfo),
            description: "Information about the current page (like length, first/last element)"
        },
        totalCount: {
            type: GraphQLNonNull(GraphQLInt),
            description: "The total number of elements matching the filter\n\n(Even ones that don't match the current page)"
        }
    })
};
const GraphQLPage = new GraphQLInterfaceType(pageConfig);
export default GraphQLPage;