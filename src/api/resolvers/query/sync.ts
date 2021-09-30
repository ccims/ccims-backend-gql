import { GraphQLBoolean, GraphQLFieldConfig, GraphQLID, GraphQLNonNull } from "graphql";
import { Pool } from "pg";
import { initTypeParsers } from "../../../common/database/DatabaseManager";
import { config } from "../../../config/Config";
import { GitHubAdapter } from "../../../sync/adapter/github/GitHubAdapter";
import { SyncManager } from "../../../sync/SyncManager";
import { SnowflakeGenerator } from "../../../utils/Snowflake";
import { ResolverContext } from "../../ResolverContext";

const node: GraphQLFieldConfig<any, ResolverContext> = {
    type: GraphQLBoolean,
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

        const idGen = new SnowflakeGenerator();
        const pool: Pool = new Pool(config.postgres);
        const client = await pool.connect();
        await initTypeParsers(client);
        client.release();
        const syncManager = new SyncManager(id, idGen, pool);
        return await syncManager.performSync(GitHubAdapter);    
    }
}

export default node;