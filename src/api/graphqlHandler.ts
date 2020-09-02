import * as core from "express-serve-static-core";
import { graphqlHTTP, GraphQLParams } from "express-graphql";
import * as graphql from "graphql";
import * as fs from "fs";
import { config } from "../config/Config";
import { RootAPIResolver } from "./resolvers/RootAPIResolver";
import { DatabaseManager } from "../common/database/DatabaseManager";
import ccimsSchema from "./resolvers/CCIMSSchema";

export function graphqlHandler(dbManager: DatabaseManager): core.RequestHandler {
    var handler = new GraphQLHandler(dbManager);
    return (req: core.Request, res: core.Response, next: core.NextFunction): any => {
        return handler.handle.call(handler, req, res, next);
    }
}

class GraphQLHandler {

    private middleware: (req: core.Request, res: core.Response) => any;

    public constructor(dbManager: DatabaseManager, numberRootResolvers?: number) {
        this.middleware = graphqlHTTP({
            schema: ccimsSchema,
            graphiql: {
                headerEditorEnabled: true
            }
        });
    }

    public handle(req: core.Request, res: core.Response, next: core.NextFunction): any {
        return this.middleware(req, res);
    }
}