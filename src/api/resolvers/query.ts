import { GraphQLObjectType } from "graphql";
import node from "./query/node";
import echo from "./query/echo";
import projects from "./listQueries/projects";

export default new GraphQLObjectType({
    name: "Query",
    description: "All queries for requesting stuff",
    fields: {
        node,
        echo,
        projects
    }
});