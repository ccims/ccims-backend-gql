import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLObjectTypeConfig } from "graphql";
import GraphQLNonFunctionalConstraint from "../nodes/GraphQLNonFunctionalConstraint";
import { ResolverContext } from "../../../ResolverContext";

const nonFunctionalConstraintEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "NonFunctionalConstraintEdge",
    description: "An edge for a NonFunctionalConstraintPage to link a cursor to an element",
    fields: () => ({
        node: {
            type: GraphQLNonFunctionalConstraint,
            description: "The NonFunctionalConstraint linked to by this edge"
        },
        cursor: {
            type: GraphQLNonNull(GraphQLString),
            description: "The cursor for use in the pagination"
        }
    })
};
const GraphQLNonFunctionalConstraintEdge = new GraphQLObjectType(nonFunctionalConstraintEdgeConfig);
export default GraphQLNonFunctionalConstraintEdge;