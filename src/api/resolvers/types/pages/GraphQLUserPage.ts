import { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLObjectTypeConfig } from "graphql";
import GraphQLPage from "./GraphQLPage";
import GraphQLPageInfo from "./GraphQLPageInfo";
import GraphQLUser from "../nodes/GraphQLUser";
import GraphQLUserEdge from "../edges/GraphQLUserEdge";
import { ResolverContext } from "../../../ResolverContext";

let userPageConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "UserPage",
    description: "A page of multiple users",
    interfaces: () => ([GraphQLPage]),
    fields: () => ({
        nodes: {
            type: GraphQLList(GraphQLUser),
            description: "All users on this page"
        },
        edges: {
            type: GraphQLList(GraphQLUserEdge),
            description: "Edges to all nodes containing the cursor"
        },
        pageInfo: {
            type: GraphQLNonNull(GraphQLPageInfo),
            description: "Information about the current page (like length, first/last element)"
        },
        totalCount: {
            type: GraphQLNonNull(GraphQLInt),
            description: "The total number of elements matching the filter\n\n(Even ones that don't match the current page)"
        }
    })
};
let GraphQLUserPage = new GraphQLObjectType(userPageConfig);
export default GraphQLUserPage;