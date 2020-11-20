import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLObjectTypeConfig } from "graphql";
import GraphQLComponent from "../nodes/GraphQLComponent";
import { ResolverContext } from "../../../ResolverContext";

const componentEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "ComponentEdge",
    description: "An edge for a ComponentPage to link a cursor to an element",
    fields: () => ({
        node: {
            type: GraphQLComponent,
            description: "The component linked to by this edge"
        },
        cursor: {
            type: GraphQLNonNull(GraphQLString),
            description: "The cursor for use in the pagination"
        }
    })
};
const GraphQLComponentEdge = new GraphQLObjectType(componentEdgeConfig);
export default GraphQLComponentEdge;