import * as core from "express-serve-static-core";
import { config } from "../../config/Config";
import jwt from "jsonwebtoken";
import { log } from "../../log";
import { User } from "../../common/nodes/User";
import { ResolverContext } from "../ResolverContext";

/**
 * Express middleware for verifying a JWT given by the client
 * 
 * Initializes and returns a handler for verifying a given JWT to authorize a user to a restricted resource
 * 
 * The handler expects the request to contain a `Authorization` header field with the following content:
 * 
 *    Bearer [JWT_TOKEN]
 * 
 * If either this header isn't provided correctly or the token provided is invalid, the request will be responded to with a
 * 401 status code and an error message speciying the reason
 * @param secret The secret used for verifying the signed JWTs. This should be a long, very hard to guess string.\
 * It must be the same as the one used for signing the JWT during login.\
 * If empty or `undefined`, the secret from the config will be utilized.
 */
export function jwtVerifier(secret?: string): core.RequestHandler {
    var verifier = new JWTVerifier(secret);
    return (req: core.Request, res: core.Response, next: core.NextFunction) => {
        verifier.handle.call(verifier, req, res, next);
    };
}

/**
 * Class managing the JWT verification for use in the Express middleware
 */
class JWTVerifier {

    /**
     * The secret to use for verifying the signed JWTs. This is supossed to be a long, very hard to guess string. It must be the same as used for signing them during login.
     */
    private secret: string;

    /**
     * Initializes the JWT verifier. To handle a request to a restricted resource, call `handle(res, req, next)`
     * 
     * @param secret The secret used for verifying the signed JWTs. This should be a long, very hard to guess string.\
     * It must be the same as the one used for signing the JWT during login.\
     * If empty or `undefined`, the secret from the config will be utilized.
     */
    constructor(secret?: string) {
        this.secret = secret || config.api.jwtSecret;
        if (this.secret.length == 0) {
            this.secret = config.api.jwtSecret;
        }
    }

    /**
     * Handles a request to a restricted resource (like the API) where a valid JWT is needed for accessing it.
     * 
     * The handler expects the request to contain a `Authorization` header field with the following content:
     * 
     *    Bearer [JWT_TOKEN]
     * 
     * If either this header isn't provided correctly or the token provided is invalid, the request will be responded to with a
     * 401 status code and an error message speciying the reason
     * 
     * If header and token are valid and the user is a valid user, the provided `next` function will be called 
     * without further action to grant access to the restricted ressource
     * 
     * __NOTICE__: If the `debugNoLogin` field in the `api.json` config file is set to `true`, the JWT and user verification will be __fully bypassed__
     * 
     * @param req The request data provided by express.\
     * This must have a valid `Authorization: Bearer [JWT_TOKEN]` header.
     * @param res A valid express respone object. This will only be used in case, verification wasn't successfull.
     * @param next The next function to call the next middleware.\
     * This will be called once the provided JWT was sucessfully verified as a valid token
     */
    public handle(req: ResolverContext, res: core.Response, next: core.NextFunction) {
        if (config.api.debugNoLogin) {
            next();
            return;
        }
        log(5, "JWT verifying");
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            jwt.verify(token, this.secret, (err, payload) => {
                if (err) {
                    log(3, "Token verification failed");
                    res.status(401).end("Token invalid. Request new one");
                } else {
                    //TODO check username
                    log(7, payload);
                    if (typeof (payload as any).name === "string") {
                        log(5, "User verified");
                        //TODO: Load user
                        req.user = {};
                        next();
                    } else {
                        log(3, "Token has no name payload");
                        res.status(401).end("Illegal token");
                    }
                }
            });
        } else {
            log(3, "Auth header invalid");
            res.status(401).end("No valid Authorization header present");
        }
    }
}