import * as fs from "fs";

export class PostgresConfig {
    public readonly user: string;
    public readonly password: string;
    public readonly database: string;
    public readonly host: string;
    public readonly port: number;

    public constructor(filePath: string) {
        let file: any | undefined;
        try {
            file = JSON.parse(fs.readFileSync(filePath, { encoding: "utf-8" }));
        } catch (e) {
            console.log(`${filePath} file for the PostgreSQL config not found. Using defaults`);
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
        if (typeof file?.host === "string") {
            this.host = file.host;
        } else {
            this.host = "localhost";
        }
        if (typeof file?.port === "number") {
            this.port = file.port;
        } else {
            this.port = 5432;
        }
    }
}