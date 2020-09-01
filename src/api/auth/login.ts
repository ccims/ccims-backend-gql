import * as core from "express-serve-static-core";
import { config } from "../../config";

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
    return (req: core.Request, res: core.Response, next: core.NextFunction) => {
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
    public handle(req: core.Request, res: core.Response, next: core.NextFunction) {

    }
}