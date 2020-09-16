import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLObjectTypeConfig } from "graphql";
import GraphQLLabel from "../nodes/GraphQLLabel";
import { ResolverContext } from "../../../ResolverContext";

let labelEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "LabelEdge",
    description: "An edge for a LabelPage to link a cursor to an element",
    fields: () => ({
        node: {
            type: GraphQLLabel,
            description: "The label linked to by this edge"
        },
        cursor: {
            type: GraphQLNonNull(GraphQLString),
            description: "The cursor for use in the pagination"
        }
    })
};
let GraphQLLabelEdge = new GraphQLObjectType(labelEdgeConfig);
export default GraphQLLabelEdge;