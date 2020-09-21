import { GraphQLFieldConfig, GraphQLScalarType, GraphQLID, GraphQLResolveInfo, GraphQLNonNull } from "graphql";
import GraphQLNode from "../types/GraphQLNode";
import { ResolverContext } from "../../ResolverContext";
import { LoadNodeListCommand } from "../../../common/database/commands/load/nodes/LoadNodeListCommand";
import { getLoadCommand } from "../../../common/database/commands/load/nodes/LoadFromIdsCommand";
import { LoadMultipleNodeListsCommand } from "../../../common/database/commands/load/nodes/LoadMultipleNodeListsCommand";

const node: GraphQLFieldConfig<any, ResolverContext> = {
    type: GraphQLNode,
    description: "Requests an object (node) using the given ID. If the given ID is invalid an error will be returned",
    args: {
        id: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the node to return. This can't be empty or null"
        }
    },
    resolve: async (src, args, context, info) => {
        if (typeof args.id !== "string") {
            throw new Error("The id for the node to get must be a valid string");
        }
        const id: string = args.id;
        if (id.length > 32) {
            throw new Error("The id string can't be longer than 32 characters");
        }
        const nodeCmd = new LoadMultipleNodeListsCommand("node");
        nodeCmd.ids = [id];
        context.dbManager.addCommand(nodeCmd);

        await context.dbManager.executePendingCommands();

        if (nodeCmd.getResult().length !== 1) {
            throw new Error("The specified ID is no valid node id");
        }
        return nodeCmd.getResult()[0];
    }
}

export default node;