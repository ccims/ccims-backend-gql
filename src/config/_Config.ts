import { APIConfig } from "./_APIConfig";
import { CommonConfig } from "./_CommonConfig";
import { PostgresConfig } from "./_PostgresConfig";

export let config = {
    postgres: new PostgresConfig("config/postgres.json"),
    api: new APIConfig("config/api.json"),
    common: new CommonConfig("config/common.json")
}