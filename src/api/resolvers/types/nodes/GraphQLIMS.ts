import { GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLID, GraphQLNonNull } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLNode from "../GraphQLNode";
import GraphQLComponent from "./GraphQLComponent";
import GraphQLIMSType from "../../enums/GraphQLIMSType";
import imsUsersListQuery from "../../listQueries/imsUsersListQuery";
import { IMSSystem } from "../../../../common/nodes/IMSSystem";
import { IMSUser } from "../../../../common/nodes/IMSUser";

const imsConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "IMS",
    description: "An issue management system. This will be an __instance__ of one of the available IMS Types.\n\nE.g. One GitHub Repository's issue page.",
    interfaces: () => ([GraphQLNode]),
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLID),
            description: "The unique ID of this IMS"
        },
        imsType: {
            type: GraphQLIMSType,
            description: "The type/system this IMS is an instance of"
        },
        component: {
            type: GraphQLComponent,
            description: "The component this IMS belongs to"
        },
        users: imsUsersListQuery<IMSSystem, IMSUser>("All IMSUsers with this IMS", ims => ims.usersProperty)
    })
};
const GraphQLIMS = new GraphQLObjectType(imsConfig);
export default GraphQLIMS;