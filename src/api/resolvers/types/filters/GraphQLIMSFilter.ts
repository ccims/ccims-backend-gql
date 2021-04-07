import { GraphQLID, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLList, GraphQLNonNull } from "graphql";

const imsFilterConfig: GraphQLInputObjectTypeConfig = {
    name: "IMSFilter",
    description: "Filter for a IMS of the system. All parameters given in this filter will be connected via _AND_",
    fields: () => ({
        components: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "The IMS must be used for at least one of the specified components" 
        }
    })
};
const GraphQLIMSFilter = new GraphQLInputObjectType(imsFilterConfig);
export default GraphQLIMSFilter;