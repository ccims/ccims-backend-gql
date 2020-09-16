import { SyncService } from "./syncService/SyncService";
import { CCIMSApi } from "./api/CCIMSApi";
import ccimsSchema from "./api/resolvers/CCIMSSchema";
import { printSchema } from "graphql";
import { log } from "./log";
import { Client } from "pg";
import { config } from "./config/Config";
import { SnowflakeGenerator } from "./utils/Snowflake";

console.log("Hello world");

export function functionToTest(a: number, b: number): number {
    return a + b;
}


//const syncService = new SyncService();
if (true) {
    const pgClient: Client = new Client(config.postgres);
    const idGen = new SnowflakeGenerator();
    const backendApi = new CCIMSApi(pgClient, idGen);
    backendApi.start();
} else {
    console.log(printSchema(ccimsSchema));
}