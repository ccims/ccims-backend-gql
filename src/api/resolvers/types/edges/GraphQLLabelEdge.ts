import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import GraphQLLabel from "../nodes/GraphQLLabel";

export default new GraphQLObjectType({
    name: "LabelEdge",
    description: "An edge for a LabelPage to link a cursor to an element",
    fields: {
        node: {
            type: GraphQLLabel,
            description: "The label linked to by this edge"
        },
        cursor: {
            type: GraphQLNonNull(GraphQLString),
            description: "The cursor for use in the pagination"
        }
    }
});