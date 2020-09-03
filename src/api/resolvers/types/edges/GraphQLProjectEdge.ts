import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import GraphQLNode from "../GraphQLNode";
import GraphQLProject from "../nodes/GraphQLProject";

export default new GraphQLObjectType({
    name: "ProjectEdge",
    description: "An edge for a ProjectPage to link a cursor to an element",
    fields: {
        node: {
            type: GraphQLProject,
            description: "The project linked to by this edge"
        },
        cursor: {
            type: GraphQLNonNull(GraphQLString),
            description: "The cursor for use in the pagination"
        }
    }
});