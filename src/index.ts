import { printSchema } from "graphql";
import { Pool } from "pg";
import ccimsSchema from "./api/resolvers/CCIMSSchema";
import { CCIMSApi } from "./api/CCIMSApi";
import { initTypeParsers } from "./common/database/DatabaseManager";
import { config } from "./config/Config";
import { SnowflakeGenerator } from "./utils/Snowflake";

console.log("Hello world");

export function functionToTest(a: number, b: number): number {
    return a + b;
}

(async () => {
    // const syncService = new SyncService();
    if (true) {
        const idGen = new SnowflakeGenerator();
        const pool: Pool = new Pool(config.postgres);
        const backendApi = new CCIMSApi(pool, idGen);
        const client = await pool.connect();
        await initTypeParsers(client);
        client.release();
        backendApi.start();
    } else {
        console.log(printSchema(ccimsSchema));
    }
})();