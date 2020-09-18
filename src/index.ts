import { SyncService } from "./syncService/syncService";
import { CCIMSApi } from "./api/CCIMSApi";
import ccimsSchema from "./api/resolvers/CCIMSSchema";
import { printSchema } from "graphql";
import { log } from "./log";
import { Client } from "pg";
import { config } from "./config/Config";
import { SnowflakeGenerator } from "./utils/Snowflake";
import { initTypeParsers } from "./common/database/DatabaseManager";

console.log("Hello world");

export function functionToTest(a: number, b: number): number {
    return a + b;
}


//const syncService = new SyncService();
if (true) {
    const idGen = new SnowflakeGenerator();
    const pgClient: Client = new Client(config.postgres);
    const backendApi = new CCIMSApi(pgClient, idGen);
    pgClient.connect().then(() => {
        initTypeParsers(pgClient);
        backendApi.start();
    })
} else {
    console.log(printSchema(ccimsSchema));
}