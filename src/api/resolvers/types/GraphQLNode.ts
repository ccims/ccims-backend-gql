import { GraphQLInterfaceType, GraphQLID, GraphQLInterfaceTypeConfig, GraphQLFieldConfigMap } from "graphql";
import { ResolverContext } from "../../ResolverContext";
import { CCIMSNode } from "../../../common/nodes/CCIMSNode";

/**
 * Generates the fields for a Node
 * @param name the name of the node
 * @param namePlural the plural for of name, defaults to name + "s"
 * @returns the fields config
 */
export function nodeFields<T extends CCIMSNode>(name: string, namePlural: string = name + "s"): GraphQLFieldConfigMap<T, ResolverContext> {
    return {
        id: {
            type: GraphQLID,
            description: `The ID of this ${name}. Every ${name} will have an non-empty and non-null edge.\n\nIf this is ever empty or null, something went wrong.`
        }
    };
}

const nodeConfig: GraphQLInterfaceTypeConfig<CCIMSNode, ResolverContext> = {
    name: "Node",
    description: "An object which can be identified by an ID - called a Node",
    fields: () => nodeFields("Node")
};
const GraphQLNode = new GraphQLInterfaceType(nodeConfig);
export default GraphQLNode;