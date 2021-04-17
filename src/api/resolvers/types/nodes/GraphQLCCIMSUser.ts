import { GraphQLNonNull, GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLString } from "graphql";
import { CCIMSUser } from "../../../../common/nodes/CCIMSUser";
import { ResolverContext } from "../../../ResolverContext";
import imsUsersListQuery from "../../listQueries/imsUsersListQuery";
import GraphQLNode from "../GraphQLNode";
import GraphQLUser, { userFields } from "./GraphQLUser";
import { IMSUser } from "../../../../common/nodes/IMSUser";

const ccimsUserConfig: GraphQLObjectTypeConfig<CCIMSUser, ResolverContext> = {
    name: "CCIMSUser",
    description: "A user of the ccims. Can be assigned to projects, components and can have multiple ims accounts",
    interfaces: () => ([GraphQLNode, GraphQLUser]),
    fields: () => ({
        ...userFields<CCIMSUser>("CCIMSUser"),
        username: {
            type: GraphQLNonNull(GraphQLString),
            description: "The unique username used for login"
        },
        imsUsers: imsUsersListQuery<CCIMSUser, IMSUser>("All IMSUsers of this CCIMSUser which match `filterBy`", user => user.linkedByUsersProperty)
    })
};
const GraphQLCCIMSUser = new GraphQLObjectType(ccimsUserConfig);
export default GraphQLCCIMSUser;