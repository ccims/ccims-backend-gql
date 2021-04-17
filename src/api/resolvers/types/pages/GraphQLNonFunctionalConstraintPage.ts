import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { createPageConfig } from "./GraphQLPage";
import GraphQLNonFunctionalConstraint from "../nodes/GraphQLNonFunctionalConstraint";
import GraphQLNonFunctionalConstraintEdge from "../edges/GraphQLNonFunctionalConstraintEdge";
import { ResolverContext } from "../../../ResolverContext";

const NonFunctionalConstraintPageConfig: GraphQLObjectTypeConfig<any, ResolverContext> = createPageConfig(() => GraphQLNonFunctionalConstraint, () => GraphQLNonFunctionalConstraintEdge, "NonFunctionalConstraint");
const GraphQLNonFunctionalConstraintPage = new GraphQLObjectType(NonFunctionalConstraintPageConfig);
export default GraphQLNonFunctionalConstraintPage;