import * as fs from "fs";

export class PostgresConfig {
    public readonly username: string;
    public readonly password: string;
    public readonly database: string;
    public readonly server: string;
    public readonly port: number;

    public constructor(filePath: string) {
        const file = JSON.parse(fs.readFileSync(filePath, { encoding: "utf-8" }));
        if (typeof file.username === "string") {
            this.username = file.username;
        } else {
            this.username = "ccims";
        }
        if (typeof file.password === "string") {
            this.password = file.password;
        } else {
            this.password = "";
        }
        if (typeof file.database === "string") {
            this.database = file.database;
        } else {
            this.database = "ccims";
        }
        if (typeof file.server === "string") {
            this.server = file.server;
        } else {
            this.server = "localhost";
        }
        if (typeof file.port === "number") {
            this.port = file.port;
        } else {
            this.port = 5432;
        }
    }
}