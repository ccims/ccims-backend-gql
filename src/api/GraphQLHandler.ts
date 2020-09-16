import * as core from "express-serve-static-core";
import { graphqlHTTP, GraphQLParams } from "express-graphql";
import { DatabaseManager } from "../common/database/DatabaseManager";
import ccimsSchema from "./resolvers/CCIMSSchema";
import { ResolverContext } from "./ResolverContext";
import testSchema from "../temp/TestSchema";
import { Client } from "pg";
import { SnowflakeGenerator } from "../utils/Snowflake";

export function graphqlHandler(pgClient: Client, idGen: SnowflakeGenerator): core.RequestHandler {
    var handler = new GraphQLHandler(pgClient, idGen);
    return (req: core.Request, res: core.Response, next: core.NextFunction): any => {
        return handler.handle.call(handler, req, res, next);
    }
}

class GraphQLHandler {

    private middleware: (req: core.Request, res: core.Response) => any;
    private pgClient: Client;
    private idGenerator: SnowflakeGenerator;

    public constructor(pgClient: Client, idGen: SnowflakeGenerator) {
        this.pgClient = pgClient;
        this.idGenerator = idGen;
        this.middleware = graphqlHTTP({
            schema: ccimsSchema,
            graphiql: {
                headerEditorEnabled: true
            }
        });
    }

    public handle(req: core.Request, res: core.Response, next: core.NextFunction): any {
        let resolverRequest: ResolverContext = req;
        resolverRequest.dbManager = new DatabaseManager(this.idGenerator, this.pgClient);
        return this.middleware(resolverRequest, res);
    }
}