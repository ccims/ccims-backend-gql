import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLObjectTypeConfig } from "graphql";
import GraphQLComponentInterface from "../nodes/GraphQLComponentInterface";
import { ResolverContext } from "../../../ResolverContext";

const componentInterfaceEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "ComponentInterfaceEdge",
    description: "An edge for a ComponentInterfacePage to link a cursor to an element",
    fields: () => ({
        node: {
            type: GraphQLComponentInterface,
            description: "The interface linked to by this edge"
        },
        cursor: {
            type: GraphQLNonNull(GraphQLString),
            description: "The cursor for use in the pagination"
        }
    })
};
const GraphQLComponentInterfaceEdge = new GraphQLObjectType(componentInterfaceEdgeConfig);
export default GraphQLComponentInterfaceEdge;