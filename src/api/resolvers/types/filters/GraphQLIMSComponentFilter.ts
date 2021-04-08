import { GraphQLID, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLList, GraphQLNonNull } from "graphql";

const imsComponentFilterConfig: GraphQLInputObjectTypeConfig = {
    name: "IMSComponentFilter",
    description: "Filter for a IMSComponent of the system. All parameters given in this filter will be connected via _AND_",
    fields: () => ({
        components: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "The IMSComponent must be used to link any IMS to at least one of the specified components" 
        },
        ims: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "The IMSComponent must be used to link at least one of the specified ims to any component" 
        }
    })
};
const GraphQLIMSComponentFilter = new GraphQLInputObjectType(imsComponentFilterConfig);
export default GraphQLIMSComponentFilter;