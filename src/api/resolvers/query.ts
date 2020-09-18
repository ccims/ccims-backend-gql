import { GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLResolveInfo } from "graphql";
import node from "./query/node";
import echo from "./query/echo";
import projectsListQuery from "./listQueries/projectsListQuery";
import { ResolverContext } from "../ResolverContext";
import currentUser from "./query/currentUser";
import { LoadProjectsCommand } from "../../common/database/commands/load/nodes/LoadProjectsCommand";

let queryConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "Query",
    description: "All queries for requesting stuff",
    fields: () => ({
        node,
        echo,
        projects: projectsListQuery("Requests all projects within the current ccims instance mathcing the `filterBy`"),
        currentUser: currentUser()
    })
};
let query = new GraphQLObjectType(queryConfig);
export default query;