import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import GraphQLNode from "../GraphQLNode";
import GraphQLProject from "../nodes/GraphQLProject";
import GraphQLReactionGroup from "../nodes/GraphQLReactionGroup";

export default new GraphQLObjectType({
    name: "ReactionGroupEdge",
    description: "An edge for a RecationGroupPage to link a cursor to an element",
    fields: {
        node: {
            type: GraphQLReactionGroup,
            description: "The reaction group linked to by this edge"
        },
        cursor: {
            type: GraphQLNonNull(GraphQLString),
            description: "The cursor for use in the pagination"
        }
    }
});