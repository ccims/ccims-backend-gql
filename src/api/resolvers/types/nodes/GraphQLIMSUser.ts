import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLNode from "../GraphQLNode";
import GraphQLUser, { userFields } from "./GraphQLUser";
import GraphQLIMS from "./GraphQLIMS";
import { IMSUser } from "../../../../common/nodes/IMSUser";

const imsUserConfig: GraphQLObjectTypeConfig<IMSUser, ResolverContext> = {
    name: "IMSUser",
    description: "A user of the ims. Can be assigned to projects, components",
    interfaces: () => ([GraphQLNode, GraphQLUser]),
    fields: () => ({
        ...userFields<IMSUser>("IMSUser"),
        ims: {
            type: GraphQLIMS,
            description: "The associated IMS of the user"
        }
    })
};
const GraphQLIMSUser = new GraphQLObjectType(imsUserConfig);
export default GraphQLIMSUser;