import express from "express";
import * as core from "express-serve-static-core";
import { config } from "../config";

export class CCIMSApi {

    private server: core.Express;

    public constructor() {
        console.log("Initializing api");
        this.server = express();
    }

    public start(): void {
        console.log("Starting api server");
        this.server.listen(config.api.port, () => {
            console.log("API server started.");
        });
    }
}
