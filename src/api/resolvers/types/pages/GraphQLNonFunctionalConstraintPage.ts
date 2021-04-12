import { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLObjectTypeConfig } from "graphql";
import GraphQLPage from "./GraphQLPage";
import GraphQLPageInfo from "./GraphQLPageInfo";
import GraphQLNonFunctionalConstraint from "../nodes/GraphQLNonFunctionalConstraint";
import GraphQLNonFunctionalConstraintEdge from "../edges/GraphQLNonFunctionalConstraintEdge";
import { ResolverContext } from "../../../ResolverContext";

const nonFunctionalConstraintPageConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "NonFunctionalConstraintPage",
    description: "A page of multiple NonFunctionalConstraints",
    interfaces: () => ([GraphQLPage]),
    fields: () => ({
        nodes: {
            type: GraphQLList(GraphQLNonFunctionalConstraint),
            description: "All NonFunctionalConstraints on this page"
        },
        edges: {
            type: GraphQLList(GraphQLNonFunctionalConstraintEdge),
            description: "Edges to all nodes containing the cursor"
        },
        pageInfo: {
            type: GraphQLNonNull(GraphQLPageInfo),
            description: "Information about the current page (like length, first/last element)"
        },
        totalCount: {
            type: GraphQLNonNull(GraphQLInt),
            description: "The total number of elements matching the filter\n\n(Even ones that don't match the current page)"
        }
    })
};
const GraphQLNonFunctionalConstraintPage = new GraphQLObjectType(nonFunctionalConstraintPageConfig);
export default GraphQLNonFunctionalConstraintPage;