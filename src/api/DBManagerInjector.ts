import * as core from "express-serve-static-core";
import { Client, Pool } from "pg";
import { ResolverContext, ResolverContextOptional } from "./ResolverContext";
import { DatabaseManager } from "../common/database/DatabaseManager";
import { SnowflakeGenerator } from "../utils/Snowflake";

/**
 * Express middleware for injecting a new DatabaseManager into the express Request object for use in later middleware/handlers
 *
 * This initializes a handler that will pass on every request it gets.
 * The only thing done to the request is creating a new instance of `DatabaseManager` and setting it as the `dbManager` field of the Request object.
 * This is only done, if the `dbManager` field is still `undefined`
 *
 * @param pool The postgres database pool to use for the creation of the database manager.
 * This can't be `null` or `undefined` and must be a valid postgres pool.
 * @param idGenerator The Snowflake generator to pass to the new database manager for id generation.
 * This can't be `null` or `undefined` and must be a valid `SnowflakeGenerator`
 * @returns An express middleware for injecting new database managers
 */
export function dbManagerInjector(pool: Pool, idGenerator: SnowflakeGenerator): core.RequestHandler {
    const injector = new DBManagerInjector(pool, idGenerator);
    return (req: core.Request, res: core.Response, next: core.NextFunction) => {
        injector.handle.call(injector, req, res, next);
    }
}

/**
 * Class representing the express middleware for injecting database managers into the request object
 *
 * This class injects a new instance of `DatabaseManager` into a express request passed to its `handle` function
 */
class DBManagerInjector {
    /**
     * The postegres database pool object used to create connections to the database
     */
    private pool: Pool;

    /**
     * The snowflake generator used for generating ids by the database manager
     *
     * This must be a valid `SnowflakeGenerator`
     */
    private idGenerator: SnowflakeGenerator;

    /**
     * Initializes a new DBManagerInjector. To inject a new Database manager into a request, call `handle(res, req, next)`
     *
     * @param pool The postgres database pool to use for the creation of the database manager.
     * This can't be `null` or `undefined` and must be a valid postgres pool.
     * @param idGenerator The Snowflake generator to pass to the new database manager for id generation.
     * This can't be `null` or `undefined` and must be a valid `SnowflakeGenerator`
     */
    public constructor(pool: Pool, idGenerator: SnowflakeGenerator) {
        if (!pool || !idGenerator) {
            throw new Error("A valid postgres pool and id generator must be given");
        }
        this.pool = pool;
        this.idGenerator = idGenerator;
    }

    /**
     * Handles an express request by injecting a new `DatabaseManager` into the request object in case there wasn't alredy one.
     *
     * This function will create a new `DatabaseManager` based on the Postgres Client and the Id generator provided in the constructor of this class.
     * The created object will be injected into the `dbManager` property of the `req` Object given.
     * In case the database manager is already set or the req object isn't a modifiable non null/undefined object, no `DatabaseManager` will be created
     *
     * @param req The Request object provided by express.
     * The newly created database manager will be injected into this object.
     * This can't be `null` or `undefined` and must be a editable object
     * @param res The respone object provided by express. This is unused and can be anything.
     * @param next The next function to call the next middleware/handler.
     * This can't be `null` or `undefined` and must be a valid, callable function
     */
    public handle(req: ResolverContextOptional, res: core.Response, next: core.NextFunction) {
        if (typeof req === "object" && req && !req.dbManager) {
            req.dbManager = new DatabaseManager(this.idGenerator, this.pool);
        }
        next();
    }
}