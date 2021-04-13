import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString } from "graphql";
import { NonFunctionalConstraint } from "../../../../common/nodes/NonFunctionalConstraint";
import { syncNodeFilterFields } from "./syncNodeFilterFields";

const nonFunctionalConstraintFilterConfig: GraphQLInputObjectTypeConfig = {
    name: "NonFunctionalConstraintFilter",
    description: "Filters for NonFunctionalConstraint matching the given properties",
    fields: () => ({
        ...syncNodeFilterFields<NonFunctionalConstraint>("NonFunctionalConstraint"),
        isActive: {
           type: GraphQLBoolean,
           description: "If true, only NonFunctionalConstraints which are currently active are returned, if false only NonFunctionalConstraints which are NOT active are returned. All are returned if not provided"
        },
        content: {
            type: GraphQLString,
            description: `The __RegEx__ the content of the NonFunctionalConstraint needs to match`
        },
        description: {
            type: GraphQLString,
            description: `The __RegEx__ the description of the NonFunctionalConstraint needs to match`
        }
    })
};
const GraphQLNonFunctionalConstraintFilter = new GraphQLInputObjectType(nonFunctionalConstraintFilterConfig);
export default GraphQLNonFunctionalConstraintFilter;