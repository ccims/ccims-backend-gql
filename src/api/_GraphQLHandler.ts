import * as core from "express-serve-static-core";
import { graphqlHTTP, GraphQLParams } from "express-graphql";
import { DatabaseManager } from "../common/database/DatabaseManager";
import ccimsSchema from "./resolvers/CCIMSSchema";
import { ResolverContext } from "./ResolverContext";

export function graphqlHandler(dbManager: DatabaseManager): core.RequestHandler {
    var handler = new GraphQLHandler(dbManager);
    return (req: core.Request, res: core.Response, next: core.NextFunction): any => {
        return handler.handle.call(handler, req, res, next);
    }
}

class GraphQLHandler {

    private middleware: (req: core.Request, res: core.Response) => any;
    private dbManager: DatabaseManager;

    public constructor(dbManager: DatabaseManager) {
        this.dbManager = dbManager;
        this.middleware = graphqlHTTP({
            schema: ccimsSchema,
            graphiql: {
                headerEditorEnabled: true
            }
        });
    }

    public handle(req: core.Request, res: core.Response, next: core.NextFunction): any {
        let resolverRequest: ResolverContext = req;
        resolverRequest.dbManager = this.dbManager;
        return this.middleware(resolverRequest, res);
    }
}