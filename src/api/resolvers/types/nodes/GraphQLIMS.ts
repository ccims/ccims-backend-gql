import { GraphQLNonNull, GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLNode, { nodeFields } from "../GraphQLNode";
import GraphQLIMSType from "../../enums/GraphQLIMSType";
import imsUsersListQuery from "../../listQueries/imsUsersListQuery";
import { IMSSystem } from "../../../../common/nodes/IMSSystem";
import { IMSUser } from "../../../../common/nodes/IMSUser";
import imsComponentsListQuery from "../../listQueries/imsComponentsListQuery";
import { IMSComponent } from "../../../../common/nodes/IMSComponent";

const imsConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "IMS",
    description: "An issue management system. This will be an __instance__ of one of the available IMS Types.\n\nE.g. a GitHub Enterprise instance, or GitHub itself.",
    interfaces: () => ([GraphQLNode]),
    fields: () => ({
        ...nodeFields<IMSSystem>("IMS"),
        imsType: {
            type: GraphQLNonNull(GraphQLIMSType),
            description: "The type/system this IMS is an instance of"
        },
        users: imsUsersListQuery<IMSSystem, IMSUser>("All IMSUsers with this IMS", ims => ims.usersProperty),
        imsComponents: imsComponentsListQuery<IMSSystem, IMSComponent>("All IMSComponents with this IMS", ims => ims.imsComponentsProperty)
    })
};
const GraphQLIMS = new GraphQLObjectType(imsConfig);
export default GraphQLIMS;