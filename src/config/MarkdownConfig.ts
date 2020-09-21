import * as fs from "fs";
import { log } from "../log";

export class MarkdownConfig {
    public readonly html: boolean;
    public readonly linkify: boolean;
    public readonly typographer: boolean;
    public readonly quotes: string;

    public constructor(filePath: string) {
        let file: any | undefined;
        try {
            file = JSON.parse(fs.readFileSync(filePath, { encoding: "utf-8" }));
        } catch (e) {
            log(3, `${filePath} file for Mardown config not found. Using defaults.`);
            log(8, e);
        }
        if (typeof file?.html === "boolean") {
            this.html = file.html;
        } else {
            this.html = true;
        }
        if (typeof file?.linkify === "boolean") {
            this.linkify = file.linkify;
        } else {
            this.linkify = true;
        }
        if (typeof file?.typographer === "boolean") {
            this.typographer = file.typographer;
        } else {
            this.typographer = true;
        }
        if (typeof file?.quotes === "string") {
            this.quotes = file.quotes;
        } else {
            this.quotes = "“”‘’"; // English quotes; German: "„“‚‘"
        }
    }
}