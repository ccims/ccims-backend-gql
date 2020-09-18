import * as fs from "fs";
import crypto from "crypto";

export class CommonConfig {
    public readonly logLevel: number;
    public readonly passwordSecret: string;
    public readonly passwordAlgorithm: string;

    public constructor(filePath: string) {
        const file = JSON.parse(fs.readFileSync(filePath, { encoding: "utf-8" }));
        if (typeof file.logLevel === "number") {
            this.logLevel = file.logLevel;
        } else {
            this.logLevel = 3;
        }
        if (typeof file.passwordSecret === "string") {
            this.passwordSecret = file.passwordSecret;
        } else {
            this.passwordSecret = "";
            const length = (Math.random() * 85) + 15;
            for (let i = 0; i < length; i++) {
                this.passwordSecret += String.fromCharCode(Math.random() * (126 - 33) + 33);
            }
        }
        const availableHashes = crypto.getHashes();
        if (typeof file.passwordAlgorithm === "string" && availableHashes.includes(file.passwordAlgorithm)) {
            this.passwordAlgorithm = file.passwordAlgorithm;
        } else {
            if (availableHashes.includes("sha256")) {
                this.passwordAlgorithm = "sha256";
            } else {
                this.passwordAlgorithm = availableHashes[Math.floor(Math.random() * availableHashes.length)];
            }
        }
    }
}