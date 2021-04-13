import { GraphQLFieldConfigMap, GraphQLID, GraphQLNonNull } from "graphql";
import { SyncNode } from "../../../../common/nodes/SyncNode";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLDate from "../../scalars/GraphQLDate";
import { nodeFields } from "../GraphQLNode";
import GraphQLUser from "./GraphQLUser";

/**
 * Generates the fields for a SyncNode
 * @param name the name of the node
 * @param namePlural the plural for of name, defaults to name + "s"
 * @returns the fields config
 */
export function syncNodeFields<T extends SyncNode>(name: string, namePlural: string = name + "s"): GraphQLFieldConfigMap<T, ResolverContext> {
    return {
        ...nodeFields<T>(name, namePlural),
        createdBy: {
            type: GraphQLUser,
            description: `The user who originally created the ${name} (in ccims or any ims)`
        },
        createdAt: {
            type: GraphQLNonNull(GraphQLDate),
            description: `The date the ${name} was first created on`
        }
    };
}