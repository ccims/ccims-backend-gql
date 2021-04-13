import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLInputObjectTypeConfig } from "graphql";
import { Label } from "../../../../common/nodes/Label";
import GraphQLColor from "../../scalars/GraphQLColor";
import { namedSyncNodeFilterFields } from "./namedSyncNodeFilterFields";

const labelFilterConfig: GraphQLInputObjectTypeConfig = {
    name: "LabelFilter",
    description: "A Filter data input for labels.  All parameters given in this filter will be connected via _AND_",
    fields: () => ({
        ...namedSyncNodeFilterFields<Label>("Label"),
        color: {
            type: GraphQLList(GraphQLNonNull(GraphQLColor)),
            description: "A list of label colours. Any one or more of the given colours need to match the labels colour."
        }
    })
};
const GraphQLLabelFilter = new GraphQLInputObjectType(labelFilterConfig);
export default GraphQLLabelFilter;