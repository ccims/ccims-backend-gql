import { GraphQLInputObjectTypeConfig, GraphQLInputObjectType, GraphQLID, GraphQLList, GraphQLNonNull } from "graphql";
import { IMSUser } from "../../../../common/nodes/IMSUser";
import { userFilterFields } from "./GraphQLUserFilter";

const imsUserFilterConfig: GraphQLInputObjectTypeConfig = {
    name: "IMSUserFilter",
    description: "Filter for a user of the system. All parameters given in this filter will be connected via _AND_",
    fields: () => ({
        ...userFilterFields<IMSUser>("IMSUser"),
        ims: {
            type: GraphQLList(GraphQLNonNull(GraphQLID)),
            description: "The IMSUser must be part of one of the specified IMS with the given ids"
        }
    })
};
const GraphQLIMSUserFilter = new GraphQLInputObjectType(imsUserFilterConfig);
export default GraphQLIMSUserFilter;