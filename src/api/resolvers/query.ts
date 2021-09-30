import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { ResolverContext } from "../ResolverContext";
import projectsListQuery from "./listQueries/projectsListQuery";
import currentUser from "./query/currentUser";
import echo from "./query/echo";
import node from "./query/node";
import checkUsername from "../publicResolvers/query/checkUsername";
import componentsListQuery from "./listQueries/componentsListQuery";
import searchUser from "./query/searchUser";
import imsListQuery from "./listQueries/imsListQuery";
import sync from "./query/sync";

const queryConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "Query",
    description: "All queries for requesting stuff",
    fields: () => ({
        node,
        echo,
        sync,
        projects: projectsListQuery("Requests all projects within the current ccims instance matching the `filterBy`"),
        components: componentsListQuery("Requests all components within the current ccims instance matching the `filterBy`"),
        imss: imsListQuery("Requests all IMSs within the current ccims instance matching the `filterBy`"),
        currentUser: currentUser(),
        checkUsername: checkUsername(),
        searchUser: searchUser()
    })
};
const query = new GraphQLObjectType(queryConfig);
export default query;