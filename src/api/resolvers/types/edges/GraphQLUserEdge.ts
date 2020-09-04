import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLObjectTypeConfig } from "graphql";
import GraphQLUser from "../nodes/GraphQLUser";
import { ResolverContext } from "../../../ResolverContext";

let userEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "UserEdge",
    description: "An edge for a UserPage to link a cursor to an element",
    fields: () => ({
        node: {
            type: GraphQLUser,
            description: "The user linked to by this edge"
        },
        cursor: {
            type: GraphQLNonNull(GraphQLString),
            description: "The cursor for use in the pagination"
        }
    })
};
let GraphQLUserEdge = new GraphQLObjectType(userEdgeConfig);
export default GraphQLUserEdge;