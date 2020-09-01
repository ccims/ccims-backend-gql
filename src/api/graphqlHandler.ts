import * as core from "express-serve-static-core";
import { graphqlHTTP } from "express-graphql";
import * as graphql from "graphql";
import * as fs from "fs";
import { config } from "../config";

export function graphqlHandler(): core.RequestHandler {
    var handler = new GraphQLHandler();
    return (req: core.Request, res: core.Response, next: core.NextFunction): void => {
        handler.handle.call(handler, req, res, next);
    }
}

class GraphQLHandler {

    private schema: graphql.GraphQLSchema;
    private middleware: (req: core.Request, res: core.Response) => void;

    public constructor() {
        this.schema = graphql.buildSchema(fs.readFileSync(config.api.schemaLocation, { encoding: "utf-8" }));
        this.middleware = graphqlHTTP({
            schema: this.schema,
            graphiql: true
        });
    }

    public handle(req: core.Request, res: core.Response, next: core.NextFunction): void {
        graphqlHTTP
    }
}