import { APIConfig } from "./APIConfig";
import { CommonConfig } from "./CommonConfig";
import { PostgresConfig } from "./PostgresConfig";
import { MarkdownConfig } from "./MarkdownConfig";

export let config = {
    postgres: new PostgresConfig("config/postgres.json"),
    api: new APIConfig("config/api.json"),
    common: new CommonConfig("config/common.json"),
    markdown: new MarkdownConfig("config/markdown.json"),
}