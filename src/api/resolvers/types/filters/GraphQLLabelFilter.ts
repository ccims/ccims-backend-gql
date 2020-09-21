import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLString, GraphQLInputObjectTypeConfig, GraphQLID } from "graphql";
import GraphQLColor from "../../scalars/GraphQLColor";
import GraphQLDate from "../../scalars/GraphQLDate";

const labelFilterConfig: GraphQLInputObjectTypeConfig = {
    name: "LabelFilter",
    description: "A Filter data input for labels.  All parameters given in this filter will be connected via _AND_",
    fields: () => ({
        name: {
            type: GraphQLList(GraphQLNonNull(GraphQLString)),
            description: "A lists of names. The label needs to match any one or more of these."
        },
        description: {
            type: GraphQLString,
            description: "The __RegEx__ the description of the label needs to match"
        },
        createdBy: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "Filters for the creator user of the label. The id of the user must match any of the given ids"
        },
        createdAfter: {
            type: GraphQLDate,
            description: "The label must have been created after the given date (inclusive) to match the filter"
        },
        createdBefore: {
            type: GraphQLDate,
            description: "The label must have been created before the given date (inclusive) to match the filter"
        },
        color: {
            type: GraphQLList(GraphQLNonNull(GraphQLColor)),
            description: "A list of label colours. Any one or more of the given colours need to match the labels colour."
        }
    })
};
const GraphQLLabelFilter = new GraphQLInputObjectType(labelFilterConfig);
export default GraphQLLabelFilter;