import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLObjectTypeConfig } from "graphql";
import GraphQLIMS from "../nodes/GraphQLIMS";
import { ResolverContext } from "../../../ResolverContext";

const imsComponentEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "IMSComponentEdge",
    description: "An edge for a IMSComponentPage to link a cursor to an element",
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
const GraphQLIMSComponentEdge = new GraphQLObjectType(imsComponentEdgeConfig);
export default GraphQLIMSComponentEdge;