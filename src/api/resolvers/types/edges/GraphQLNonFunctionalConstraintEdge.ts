import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import GraphQLNonFunctionalConstraint from "../nodes/GraphQLNonFunctionalConstraint";
import { ResolverContext } from "../../../ResolverContext";
import { createEdge } from "./createEdge";

const nonFunctionalConstraintEdgeConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createEdge(() => GraphQLNonFunctionalConstraint, "NonFunctionalConstraint");
const GraphQLNonFunctionalConstraintEdge = new GraphQLObjectType(nonFunctionalConstraintEdgeConfig);
export default GraphQLNonFunctionalConstraintEdge;