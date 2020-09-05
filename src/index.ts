import { SyncService } from "./syncService/SyncService";
import { CCIMSApi } from "./api/_CCIMSApi";
import ccimsSchema from "./api/resolvers/CCIMSSchema";
import { printSchema } from "graphql";
import { log } from "./log";

console.log("Hello world");

export function functionToTest(a: number, b: number): number {
    return a + b;
}


//const syncService = new SyncService();
if (true) {
    const backendApi = new CCIMSApi({ hallo: "welt" });
    backendApi.start();
} else {
    console.log(printSchema(ccimsSchema));
}