import * as core from "express-serve-static-core";
import { User } from "../common/nodes/User";
import { DatabaseManager } from "../common/database/DatabaseManager";

export interface ResolverContext extends core.Request {
    user: User;
    dbManager: DatabaseManager;
}

export interface ResolverContextOptional extends core.Request {
    user?: User;
    dbManager?: DatabaseManager;
}