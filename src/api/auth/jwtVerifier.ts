import * as core from "express-serve-static-core";
import { config } from "../../config";


export function jwtVerifier(secret?: string): core.RequestHandler {
    var verifier = new JWTVerifier(secret);
    return (req: core.Request, res: core.Response, next: core.NextFunction) => {
        verifier.handle.call(verifier, req, res, next);
    };
}

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
     * @param req The request data provided by express.\
     * This must have a valid `Authorization: Bearer [JWT_TOKEN]` header.
     * @param res A valid express respone object. This will only be used in case, verification wasn't successfull.
     * @param next The next function to call the next middleware.\
     * This will be called once the provided JWT was sucessfully verified as a valid token
     */
    public handle(req: core.Request, res: core.Response, next: core.NextFunction) {

    }
}