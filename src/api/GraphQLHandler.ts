import * as core from "express-serve-static-core";
import { graphqlHTTP, GraphQLParams } from "express-graphql";
import { ResolverContext, ResolverContextOptional } from "./ResolverContext";
import { log } from "../log";
import { GraphQLSchema } from "graphql";

/**
 * Express middleware/handler for parsing and processing a graphql request and responding to it
 *
 * This method generates a express middleware that takes requests and processes the contained graphql request
 * using a database manager contained within the `req.dbManager` and the user from the `req.user`property.
 *
 * All requests must conform to the GraphQL-Schema based from `./resolvers/CCIMSSchema.ts`
 *
 * @param schema This GraphQLSchema will be used to resolve quries.
 * @param noUserNeeded If `true` is given, the ckeck for the user in the ResolverContext will be ommited
 * @returns An express middleware handler performing the actual CCIMS API work
 */
export function graphqlHandler(schema: GraphQLSchema, noUserNeeded?: boolean): core.RequestHandler {
    const handler = new GraphQLHandler(schema, noUserNeeded);
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
    public constructor(schema: GraphQLSchema, private readonly noUserNeeded?: boolean) {
        this.middleware = graphqlHTTP({
            schema,
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
        if (!req.dbManager) {
            log(2, "Database manager empty");
            res.status(500).end("Error while processing request");
        } else {
            if (!this.noUserNeeded && !req.user) {
                log(2, "Logged in user was empty");
                res.status(500).end("Error while processing request");
            } else {
                const resolverRequest: ResolverContext = req as ResolverContext;
                const result = await this.middleware(resolverRequest, res);
                await req.dbManager.saveAndClearCache();
                return result;
            }
        }
    }
}