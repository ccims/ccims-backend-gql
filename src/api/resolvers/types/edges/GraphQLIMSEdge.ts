import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLObjectTypeConfig } from "graphql";
import GraphQLIMS from "../nodes/GraphQLIMS";
import { ResolverContext } from "../../../ResolverContext";

const imsEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "IMSEdge",
    description: "An edge for a IMSPage to link a cursor to an element",
    fields: () => ({
        node: {
            type: GraphQLIMS,
            description: "The ims linked to by this edge"
        },
        cursor: {
            type: GraphQLNonNull(GraphQLString),
            description: "The cursor for use in the pagination"
        }
    })
};
const GraphQLIMSEdge = new GraphQLObjectType(imsEdgeConfig);
export default GraphQLIMSEdge;