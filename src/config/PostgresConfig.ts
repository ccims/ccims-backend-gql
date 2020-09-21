import * as fs from "fs";
import { log } from "../log";

export class PostgresConfig {
    public readonly user: string;
    public readonly password: string;
    public readonly database: string;
    public readonly server: string;
    public readonly port: number;

    public constructor(filePath: string) {
        let file: any | undefined;
        try {
            file = JSON.parse(fs.readFileSync(filePath, { encoding: "utf-8" }));
        } catch (e) {
            log(3, `${filePath} file for the PostgreSQL config not found. Using defaults`);
            log(8, e);
        }
        if (typeof file?.user === "string") {
            this.user = file.user;
        } else {
            this.user = "ccims";
        }
        if (typeof file?.password === "string") {
            this.password = file.password;
        } else {
            this.password = "";
        }
        if (typeof file?.database === "string") {
            this.database = file.database;
        } else {
            this.database = "ccims";
        }
        if (typeof file?.server === "string") {
            this.server = file.server;
        } else {
            this.server = "localhost";
        }
        if (typeof file?.port === "number") {
            this.port = file.port;
        } else {
            this.port = 5432;
        }
    }
}