import { SyncService } from "./syncService/SyncService";
import { CCIMSApi } from "./api/CCIMSApi";
import ccimsSchema from "./api/resolvers/CCIMSSchema";
import { printSchema } from "graphql";
import { log } from "./log";
import testSchema from "./temp/TestSchema";

console.log("Hello world");

export function functionToTest(a: number, b: number): number {
    return a + b;
}


//const syncService = new SyncService();
if (false) {
    const backendApi = new CCIMSApi({});
    backendApi.start();
} else {
    console.log(printSchema(ccimsSchema));
}