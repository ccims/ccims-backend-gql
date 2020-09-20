import * as core from "express-serve-static-core";
import { graphqlHTTP, GraphQLParams } from "express-graphql";
import ccimsSchema from "./resolvers/CCIMSSchema";
import { ResolverContext, ResolverContextOptional } from "./ResolverContext";
import { log } from "../log";

/**
 * Express middleware/handler for parsing and processing a graphql request and responding to it
 *
 * This method generates a express middleware that takes requests and processes the contained graphql request
 * using a database manager contained within the `req.dbManager` and the user from the `req.user`property.
 *
 * All requests must conform to the GraphQL-Schema based from `./resolvers/CCIMSSchema.ts`
 *
 * @returns An express middleware handler performing the actual CCIMS API work
 */
export function graphqlHandler(): core.RequestHandler {
    const handler = new GraphQLHandler();
    return async (req: ResolverContextOptional, res: core.Response, next: core.NextFunction): Promise<any> => {
        return handler.handle.call(handler, req, res, next);
    }
}

/**
 * Class for handling express requests with graphql requests to the CCIMS API
 */
class GraphQLHandler {

    /**
     * The middleware provided by the `express-graphql` library
     */
    private middleware: (req: core.Request, res: core.Response) => any;

    /**
     * Initializes a new GraphQLHandler for handling requests to the ccims API
     *
     * For debugging graphiql is also provided.
     */
    public constructor() {
        this.middleware = graphqlHTTP({
            schema: ccimsSchema,
            graphiql: {
                headerEditorEnabled: true
            }
        });
    }

    /**
     * Handles and resolves the graphql request contained in the req object by using the middleware provided by `express-graphql`
     * @param req The graphql request object containing a database manager and a user for use in resolving the request
     * @param res The express response object. Passed directly on to the express-graphql handler
     * @param next The next function to the next middleware. Won't be called as this handler will always resolve the request
     */
    public async handle(req: ResolverContextOptional, res: core.Response, next: core.NextFunction): Promise<any> {
        if (!req.user || !req.dbManager) {
            log(2, "Database manager or logged in user empty");
            res.status(500).end("Error while processing request");
        } else {
            const resolverRequest: ResolverContext = req as ResolverContext;
            const result = await this.middleware(resolverRequest, res);
            req.dbManager.saveAndClearCache();
            return result;
        }
    }
}