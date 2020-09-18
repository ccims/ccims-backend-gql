import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLString, GraphQLInputObjectTypeConfig } from "graphql";
import GraphQLColor from "../../scalars/GraphQLColor";

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
        color: {
            type: GraphQLList(GraphQLNonNull(GraphQLColor)),
            description: "A list of label colours. Any one or more of the given colours need to match the labels colour."
        }
    })
};
const GraphQLLabelFilter = new GraphQLInputObjectType(labelFilterConfig);
export default GraphQLLabelFilter;