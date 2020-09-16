import * as core from "express-serve-static-core";
import { graphqlHTTP, GraphQLParams } from "express-graphql";
import { DatabaseManager } from "../common/database/DatabaseManager";
import ccimsSchema from "./resolvers/CCIMSSchema";
import { ResolverContext } from "./ResolverContext";
import testSchema from "../temp/TestSchema";
import { Client } from "pg";
import { SnowflakeGenerator } from "../utils/Snowflake";

export function graphqlHandler(): core.RequestHandler {
    var handler = new GraphQLHandler();
    return (req: core.Request, res: core.Response, next: core.NextFunction): any => {
        return handler.handle.call(handler, req, res, next);
    }
}

class GraphQLHandler {

    private middleware: (req: core.Request, res: core.Response) => any;

    public constructor() {
        this.middleware = graphqlHTTP({
            schema: ccimsSchema,
            graphiql: {
                headerEditorEnabled: true
            }
        });
    }

    public handle(req: core.Request, res: core.Response, next: core.NextFunction): any {
        let resolverRequest: ResolverContext = req;
        return this.middleware(resolverRequest, res);
    }
}