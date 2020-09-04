import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import node from "./query/node";
import echo from "./query/echo";
import projects from "./listQueries/projects";
import { ResolverContext } from "../ResolverContext";

let queryConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "Query",
    description: "All queries for requesting stuff",
    fields: () => ({
        node,
        echo,
        projects
    })
};
let query = new GraphQLObjectType(queryConfig);
export default query;