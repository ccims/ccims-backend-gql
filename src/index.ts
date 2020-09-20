import { printSchema } from "graphql";
import { Client } from "pg";
import { CCIMSApi } from "./api/CCIMSApi";
import ccimsSchema from "./api/resolvers/CCIMSSchema";
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
        const pgClient: Client = new Client(config.postgres);
        const backendApi = new CCIMSApi(pgClient, idGen);
        await pgClient.connect()
        await initTypeParsers(pgClient)
        backendApi.start();
    } else {
        console.log(printSchema(ccimsSchema));
    }
})();