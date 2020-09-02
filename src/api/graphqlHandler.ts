import * as core from "express-serve-static-core";
import { graphqlHTTP, GraphQLParams } from "express-graphql";
import * as graphql from "graphql";
import * as fs from "fs";
import { config } from "../config/config";
import { RootAPIResolver } from "./resolvers/RootApiResolver";

export function graphqlHandler(): core.RequestHandler {
    var handler = new GraphQLHandler();
    return (req: core.Request, res: core.Response, next: core.NextFunction): any => {
        return handler.handle.call(handler, req, res, next);
    }
}

class GraphQLHandler {

    private schema: graphql.GraphQLSchema;
    private middleware: (req: core.Request, res: core.Response) => any;

    public constructor() {
        this.schema = graphql.buildSchema(fs.readFileSync(config.api.schemaLocation, { encoding: "utf-8" }));
        this.middleware = graphqlHTTP({
            schema: this.schema,
            graphiql: {
                headerEditorEnabled: true
            },
            rootValue: (req: core.Request, res: core.Response, params: GraphQLParams): RootAPIResolver => { return {}; }
        });
    }

    public handle(req: core.Request, res: core.Response, next: core.NextFunction): any {
        return this.middleware(req, res);
    }
}