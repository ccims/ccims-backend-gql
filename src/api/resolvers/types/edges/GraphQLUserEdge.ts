import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import GraphQLNode from "../GraphQLNode";
import GraphQLProject from "../nodes/GraphQLProject";
import GraphQLUser from "../nodes/GraphQLUser";

export default new GraphQLObjectType({
    name: "UserEdge",
    description: "An edge for a UserPage to link a cursor to an element",
    fields: {
        node: {
            type: GraphQLUser,
            description: "The user linked to by this edge"
        },
        cursor: {
            type: GraphQLNonNull(GraphQLString),
            description: "The cursor for use in the pagination"
        }
    }
});