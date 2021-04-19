import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLString } from "graphql";
import { NonFunctionalConstraint } from "../../../../common/nodes/NonFunctionalConstraint";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLNode from "../GraphQLNode";
import GraphQLIssue from "./GraphQLIssue";
import { syncNodeFields } from "./syncNodeFields";

const nonFunctionalConstraintConfig: GraphQLObjectTypeConfig<NonFunctionalConstraint, ResolverContext> = {
    name: "NonFunctionalConstraint",
    description: "A non functional constraint assignable to a specific issue. A NonFunctionalConstraint is per-issue",
    interfaces: () => ([GraphQLNode]),
    fields: () => ({
        ...syncNodeFields<NonFunctionalConstraint>("NonFunctionalConstraint"),
        content: {
            type: GraphQLNonNull(GraphQLString),
            description: "The content of the constraint, defines the constraint"
        },
        description: {
            type: GraphQLNonNull(GraphQLString),
            description: "A textual description (of the function) of this NonFunctionalConstraint.\n\nMax. 65536 characters"
        },
        isActive: {
            type: GraphQLNonNull(GraphQLBoolean),
            description: "True iff the NonFunctionalConstraint is currently active on the issue."
        },
        issue: {
            type: GraphQLNonNull(GraphQLIssue),
            description: "The issue this NonFunctionalConstraint is part of (this is also provided if the NonFunctionalConstraint is not active)"
        }
    })
};
const GraphQLNonFunctionalConstraint = new GraphQLObjectType(nonFunctionalConstraintConfig);
export default GraphQLNonFunctionalConstraint;