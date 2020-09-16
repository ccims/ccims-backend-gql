import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLObjectTypeConfig } from "graphql";
import GraphQLNode from "../GraphQLNode";
import GraphQLProject from "../nodes/GraphQLProject";
import GraphQLReactionGroup from "../nodes/GraphQLReactionGroup";
import { ResolverContext } from "../../../ResolverContext";

let reactionGroupEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "ReactionGroupEdge",
    description: "An edge for a RecationGroupPage to link a cursor to an element",
    fields: () => ({
        node: {
            type: GraphQLReactionGroup,
            description: "The reaction group linked to by this edge"
        },
        cursor: {
            type: GraphQLNonNull(GraphQLString),
            description: "The cursor for use in the pagination"
        }
    })
};
let GraphQLReactionGroupEdge = new GraphQLObjectType(reactionGroupEdgeConfig);
export default GraphQLReactionGroupEdge;