import * as fs from "fs";

export class APIConfig {
    public readonly hostIface: string;
    public readonly port: number;
    public readonly jwtSecret: string;
    public readonly debugNoLogin: boolean;
    public readonly schemaLocation: string;
    public readonly numReactionUsers: number;
    public readonly createAllUsersAsGlobalAdmin: boolean;

    public constructor(filePath: string) {
        let file: any | undefined;
        try {
            file = JSON.parse(fs.readFileSync(filePath, { encoding: "utf-8" }));
        } catch (e) {
            console.log(3, `${filePath} file for the API config not found. Using defaults`);
        }
        if (typeof file?.hostIface === "string") {
            this.hostIface = file.hostIface;
        } else {
            this.hostIface = "0.0.0.0";
        }
        if (typeof file?.port === "number") {
            this.port = file.port;
        } else {
            this.port = 8080;
        }
        if (typeof file?.jwtSecret === "string") {
            this.jwtSecret = file.jwtSecret;
        } else {
            this.jwtSecret = "";
            const length = (Math.random() * 85) + 15;
            for (let i = 0; i < length; i++) {
                this.jwtSecret += String.fromCharCode(Math.random() * (126 - 33) + 33);
            }
        }
        if (typeof file?.debugNoLogin === "boolean") {
            this.debugNoLogin = file.debugNoLogin;
        } else {
            this.debugNoLogin = false;
        }
        if (typeof file?.schemaLocation === "string") {
            this.schemaLocation = file.schemaLocation;
        } else {
            this.schemaLocation = "./schema/schema.graphql";
        }
        if (typeof file?.numReactionUsers === "number") {
            this.numReactionUsers = file.numReactionUsers;
        } else {
            this.numReactionUsers = 5;
        }
        if (typeof file?.createAllUsersAsGlobalAdmin === "boolean") {
            this.createAllUsersAsGlobalAdmin = file.createAllUsersAsGlobalAdmin;
        } else {
            this.createAllUsersAsGlobalAdmin = false
        }
    }
}