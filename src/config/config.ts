import { APIConfig } from "./apiConfig";
import { CommonConfig } from "./commonConfig";
import { PostgresConfig } from "./postgresConfig";

export let config = {
    postgres: new PostgresConfig("config/postgres.json"),
    api: new APIConfig("config/api.json"),
    common: new CommonConfig("config/common.json")
}