import * as core from "express-serve-static-core";
import { config } from "../../config/config";
import jwt from "jsonwebtoken";
import { log } from "../../log";

/**
 * Express middleware for generating and returning a JWT
 * 
 * Initializes and returns a handler for verifying given user credentials and returning a valid JWT for use in API requests.
 * 
 * The handler expects the `req.body` field given on invocation to be valid, parsed JSON data containing the user and password as well as information about the client connecting
 * @param secret The secret to use for JWT signing. This must be the same as used for verifying.\
 * If empty or `undefined` the secret in the config will be used
 */
export function loginHandler(secret?: string): core.RequestHandler {
    var handler = new LoginHandler(secret);
    return (req: core.Request, res: core.Response, next: core.NextFunction): void => {
        handler.handle.call(handler, req, res, next);
    };
}

/**
 * Class managing the JWT creation and client verification for use in the Express middleware
 */
class LoginHandler {

    /**
     * The secret to use for signing the JWTs. This is supossed to be a long, very hard to guess string
     */
    private secret: string;

    /**
     * Initializes the JWT creating Login handler. To handle a login request call `handle(res, req, next)`
     * 
     * @param secret The secret used for signing the JWTs generated. This should be a long, very hard to guess string.\
     * It must be the same as the one used for verifying the JWTs.\
     * If empty or `undefined`, the secret from the config will be utilized.
     */
    constructor(secret?: string) {
        this.secret = secret || config.api.jwtSecret;
        if (this.secret.length == 0) {
            this.secret = config.api.jwtSecret;
        }
    }

    /**
     * Handles a login request by a client, generating a JWT
     * 
     * This function takes the request containing the login information and verifies it.\
     * - If the credentials are valid, a new JWT is generated and returned in the response with status code 200\
     * - If the credentials are invalid, a 401 error wil be returned
     * 
     * Expected structure of the credentials in the request body:
     * 
     *    {
     *       "username": "[USERNAME]",
     *       "password": "[PASSWORD]",
     *       "client": {
     *          "name": "[HUMAN_READABLE_CLIENT_NAME]",
     *       }
     *    }
     * 
     * The client information is optional.
     * 
     * @param req The request data provided by express.\
     * This must have valid, parsed JSON as `req.body` containing the username, password and information about the client connecting
     * @param res Object used for responding to the request. Must be a valid express Response object
     * @param next The next function to call the next middleware.\
     * UNUSED and won't be called, as this middleware will terminate the request in all cases
     */
    public handle(req: core.Request, res: core.Response, next: core.NextFunction): void {
        const userInfo: UserCredentials = req.body;
        //TODO: Verify user credentials
        log(5, "User login attempt");
        log(7, userInfo);
        if (UserCredentials.checkCredentialStructure(userInfo)) {
            const webToken = jwt.sign({
                name: userInfo.username,
            }, this.secret, {
                subject: "USER_ID",
                issuer: "PROCESS_ID"
            });
            log(5, "Successfull login");
            log(7, webToken);
            res.status(200).json({ token: webToken });
            return;
        }
        log(3, "Failed login attempt");
        res.status(401).end("Invalid user credential format",);
    }
}

/**
 * Class specifying the structure the user credentials provided on login must have.
 * 
 * This class also provides a static method for checking weather a given instance is valid
 * 
 * User credentials must have at least the following fields:
 * - `username`: The plain text username of the user as string
 * - `password`: The plain text password of the user as string
 * - Optional: `client`: A `ClientInfo` providing more information on the connecting client
 */
class UserCredentials {

    /**
     * The plain text username of a user as string.\
     * This can't be empty or undefined/null.
     */
    public username: string;

    /**
     * The plain text password of a user as string.\
     * This can't be empty or undefined/null.
     */
    public password: string;

    /**
     * Information about the client the user is connecting with.\
     * Can be undefined or a valid `ClientInfo` object but not null
     */
    public client: ClientInfo | undefined;

    /**
     * DON'T USE
     */
    private constructor() {
        this.username = "";
        this.password = "";
    }

    /**
     * Checks weather the given object is a vald instance of `UserCredentials`
     * 
     * Returns true iff the provided object has (at least) the following structure:
     * 
     *    {
     *       "username": "[USERNAME]",
     *       "password": "[PASSWORD]",
     *       "client": {
     *          "name": "[HUMAN_READABLE_CLIENT_NAME]",
     *       }
     *    }
     * 
     * The client property is optional.
     * 
     * __NOTICE__: This doesn't check weather the credentials themselves are valid
     * @param credentials The instance of `UserCredentials` to check
     */
    public static checkCredentialStructure(credentials: UserCredentials): boolean {
        if (typeof credentials !== "object" || credentials === null) {
            return false;
        }
        if (typeof credentials.username !== "string" || credentials.username.length <= 0) {
            return false;
        }
        if (typeof credentials.password !== "string" || credentials.password.length <= 0) {
            return false;
        }
        if (typeof credentials.client !== "object" || !ClientInfo.checkClientInfoStructure(credentials.client)) {
            if (typeof credentials.client !== "undefined") {
                return false;
            }
        }
        return true;
    }
}

/**
 * Class specifying the valid structure for the client information field in the user credentials
 * 
 * This class also provides a static method for checking weather a given instance is valid
 * 
 * Client information consists of at least the following fields
 * - Optional: `name`: A human readable string representation of the name of the client software used to connect to the API
 */
class ClientInfo {

    /**
     * A human readable name (string) of the software used to connect to the API.\
     * This can be a valid or empty string, undefined but not null
     */
    public name: string | undefined;

    /**
     * Checks weather the given object is a vald instance of `ClientInfo`
     * 
     * Returns true iff the provided object has (at least) the following structure:
     * 
     *    {
     *       "name": "[HUMAN_READABLE_CLIENT_NAME]",
     *    }
     * 
     * The name property is optional.
     * 
     * @param credentials The instance of `ClientInfo` to check
     */
    public static checkClientInfoStructure(info: ClientInfo): boolean {
        if (typeof info !== "object" || info === null) {
            return false;
        }
        if (typeof info.name !== "string" || typeof info.name !== "undefined") {
            return false;
        }
        return true;
    }
}