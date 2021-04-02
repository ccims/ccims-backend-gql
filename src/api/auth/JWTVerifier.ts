import * as core from "express-serve-static-core";
import { config } from "../../config/Config";
import jwt from "jsonwebtoken";
import { log } from "../../log";
import { ResolverContext, ResolverContextOptional } from "../ResolverContext";
import { LoadCCIMSUsersCommand } from "../../common/database/commands/load/nodes/LoadCCIMSUsersCommand";

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
 * @returns An express middleware for verifying passed json web tokens
 */
export function jwtVerifier(secret?: string): core.RequestHandler {
    const verifier = new JWTVerifier(secret);
    return async (req: core.Request, res: core.Response, next: core.NextFunction) => {
        await verifier.handle.call(verifier, req, res, next);
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
    public async handle(req: ResolverContextOptional, res: core.Response, next: core.NextFunction) {
        if (config.api.debugNoLogin) {
            if (req.dbManager) {
                const cmd = new LoadCCIMSUsersCommand();
                cmd.ids = ["0"];
                req.dbManager.addCommand(cmd);
                await req.dbManager.executePendingCommands();
                const result = cmd.getResult();
                req.user = result[0];
            }
            next();
            return;
        }
        if (!req.dbManager) {
            log(2, "Database manager undefined during JWT verification");
            res.status(500).end(JSON.stringify({ "error": "Error during token verification" }));
            return;
        }
        log(5, "JWT verifying");
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            jwt.verify(token, this.secret, async (err, payload) => {
                if (err || !payload) {
                    log(3, "Token verification failed");
                    res.status(401).end(JSON.stringify({ "error": "Token invalid. Request new one" }));
                } else {
                    const checkedPayload: JWTPayload = payload as JWTPayload;
                    if (JWTPayload.checkJWTPayload(checkedPayload)) {
                        log(7, checkedPayload);
                        const userId = checkedPayload.sub;
                        const cmd = new LoadCCIMSUsersCommand();
                        cmd.ids = [userId];
                        req.dbManager?.addCommand(cmd);
                        await req.dbManager?.executePendingCommands();
                        const result = cmd.getResult();
                        if (result.length === 1 && result[0].id === userId && result[0].username === checkedPayload.name) {
                            log(5, "User verified");
                            req.user = result[0];
                            next();
                        } else {
                            log(3, "Illegal token payload for user " + checkedPayload.name);
                            res.status(401).end(JSON.stringify({ "error": "Illegal token" }));
                        }
                    } else {
                        log(3, "Token has no correct payload");
                        res.status(401).end(JSON.stringify({ "error": "Illegal token" }));
                    }
                }
            });
        } else {
            log(3, "Auth header invalid");
            res.status(401).end(JSON.stringify({ "error": "No valid Authorization header present" }));
        }
    }
}

/**
 * Class specifying the structure a valid JWT payload must have
 *
 * This class also provides a static method for checking weather a given instance is valid
 *
 * For valid Fields of a JWT payload see https://tools.ietf.org/html/rfc7519#section-4.1.2
 * In this case the iss, sub and name claims are required to be present
 */
class JWTPayload {

    /**
     * The issuer of the JWT.
     * This can't be empty, undefined or null and must be a valid string
     */
    public iss: string;

    /**
     * The subject of the JWT - The ID of the user the JWT was created for.
     * This can't be empty, undefined or null and must be a valid string
     */
    public sub: string;

    /**
     * The user name (NOT the display name) of the user the JWT was created for
     * This can't be empty, undefined or null and must be a valid string
     */
    public name: string;

    /**
     * The date this JWT expires at
     * This must either be a valid unix date (seconds from `1970-01-01T00:00:00Z UTC`) or not given (`undefined`)
     */
    public exp: number | undefined;

    /**
     * The date before which this JWT is invalid
     * This must either be a valid unix date (seconds from `1970-01-01T00:00:00Z UTC`) or not given (`undefined`)
     */
    public nbf: number | undefined;

    /**
     * DON'T USE
     */
    constructor() {
        this.iss = "";
        this.sub = "";
        this.name = "";
    }

    /**
     * Returns weather the given object is a valid JWT payload.
     *
     * The given object must have all the fields specified by this class with the correct type to be a valid payload
     *
     * __NOTICE__: THis doesn't check weather the user is valid or the date is within the optional interval from nbf to exp
     * @param payload The JWTPayload-like object to be checked for correct structure
     */
    public static checkJWTPayload(payload: JWTPayload): boolean {
        if (payload === undefined || typeof payload !== "object") {
            return false;
        }
        if (typeof payload.iss !== "string" || typeof payload.sub !== "string" || typeof payload.name !== "string") {
            return false;
        }
        if (payload.iss.length <= 0 || payload.sub.length <= 0 || payload.name.length <= 0) {
            return false;
        }
        if (typeof payload.exp !== "number" && typeof payload.exp !== "undefined") {
            return false;
        }
        if (typeof payload.nbf !== "number" && typeof payload.nbf !== "undefined") {
            return false;
        }
        return true;
    }
}