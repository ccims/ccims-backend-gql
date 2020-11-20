import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { ResolverContext } from "../ResolverContext";
import projectsListQuery from "./listQueries/projectsListQuery";
import currentUser from "./query/currentUser";
import echo from "./query/echo";
import node from "./query/node";
import checkUsername from "../publicResolvers/query/checkUsername";

const queryConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "Query",
    description: "All queries for requesting stuff",
    fields: () => ({
        node,
        echo,
        projects: projectsListQuery("Requests all projects within the current ccims instance mathcing the `filterBy`"),
        currentUser: currentUser(),
        checkUsername: checkUsername()
    })
};
const query = new GraphQLObjectType(queryConfig);
export default query;