import express from "express";
import * as core from "express-serve-static-core";
import { config } from "../config/Config";
import { loginHandler } from "./auth/LoginHandler";
import bodyParser from "body-parser";
import cors from "cors";
import { jwtVerifier } from "./auth/JWTVerifier";
import { graphqlHandler } from "./GraphQLHandler";
import { DatabaseManager } from "../common/database/DatabaseManager";
import { Client } from "pg";
import { SnowflakeGenerator } from "../utils/Snowflake";



/**
 * The main class for the API part of ccims. It is the enty-point for the GraphQL-API to the frontend and other clients
 */
export class CCIMSApi {

    /**
     * The Instance of the express server used by this instance of the API
     */
    private server: core.Express;

    /**
     * The port which the API server is supposed to listen on for login and API requests
     */
    private port: number;

    /**
     * The IP-Address of the network interface the server will be bound to; empty or 0.0.0.0 for all interfaces
     */
    private hostIface: string;

    /**
     * Constructs the API server and specifies the routes but doesn't start it yet. This will only prepare the server, start it using `start()`
     * 
     * @param port Port on which the API and login server will listen.\
     * If `undefined`, value from config will be used.
     * 
     * @param hostIface The IP address of the network interface to which the server will be bound.\
     *  If empty, or `undefined`, the value in the config will be used.\
     * If 0.0.0.0 server will be bound to all availale interfaces.
     */
    public constructor(pgClient: Client, idGen: SnowflakeGenerator, port?: number, hostIface?: string) {
        console.log("Initializing api");
        this.port = port || config.api.port;
        this.hostIface = hostIface || config.api.hostIface || "0.0.0.0";
        if (this.hostIface.length == 0) {
            this.hostIface = "0.0.0.0";
        }
        this.server = express();
        this.setupRoutes(pgClient, idGen);
    }

    /**
     * Specifies the routes and the behaviour of the server on those routes.
     * 
     * CORS-headers will be sent for all requests to allow usage of the server from all origins
     * 
     * Available routes:
     * - POST to `/login`
     *    - Valid user credentials in the body requires
     *    - Creates and returns a new valid JWT on successfull user verification
     * - POST to `/api`
     *    - The main graphGL API
     *    - Requires valid JWT in the `Authorization`header
     */
    private setupRoutes(pgClient: Client, idGen: SnowflakeGenerator) {
        this.server.use(cors());
        this.server.post("/login", bodyParser.json(), loginHandler());
        this.server.use("/api", jwtVerifier(), graphqlHandler(pgClient, idGen));
    }

    /**
     * Starts the API server
     * 
     * When calling this method the server will be bound to the interfaces and the port 
     * specified in the constructor and start accepting incoming requests.\
     * The server listenes for the following types of requests:
     * - POST to `/login` for authenticating a user and requesting a JWT for the session
     * - POST to `/api` with a valid JWT in the `Authorization` header field
     */
    public start(): void {
        console.log("Starting api server");
        this.server.listen(this.port, this.hostIface, () => {
            console.log("API server started.");
        });
    }
}
