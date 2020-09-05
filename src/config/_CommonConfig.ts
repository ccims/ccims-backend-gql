import * as fs from "fs";

export class CommonConfig {
    public readonly logLevel: number;

    public constructor(filePath: string) {
        const file = JSON.parse(fs.readFileSync(filePath, { encoding: "utf-8" }));
        if (typeof file.logLevel === "number") {
            this.logLevel = file.logLevel;
        } else {
            this.logLevel = 3;
        }
    }
}