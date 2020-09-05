import { SyncService } from "./syncService/SyncService";
import { CCIMSApi } from "./api/ccimsApi";

console.log("Hello world");

export function functionToTest(a: number, b: number): number {
    return a + b;
}


const syncService = new SyncService();
const backendApi = new CCIMSApi();
backendApi.start();