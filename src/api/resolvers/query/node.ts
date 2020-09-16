import { GraphQLFieldConfig, GraphQLScalarType, GraphQLID, GraphQLResolveInfo, GraphQLNonNull } from "graphql";
import GraphQLNode from "../types/GraphQLNode";
import { ResolverContext } from "../../ResolverContext";

let node: GraphQLFieldConfig<any, any, any> = {
    type: GraphQLNode,
    description: "Requests an object (node) using the given ID. If the given ID is invalid an error will be returned",
    args: {
        id: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the node to return. This can't be empty or null"
        }
    },
    resolve: (parent: any, args: { id: string }, context: ResolverContext, info: GraphQLResolveInfo): any => {
        //TODO: Return proper node, change return type to ccimsnode
    }
}

export default node;