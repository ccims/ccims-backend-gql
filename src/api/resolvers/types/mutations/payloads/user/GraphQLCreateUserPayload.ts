import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString } from "graphql";
import { ResolverContext } from "../../../../../ResolverContext";
import GraphQLCCIMSUser from "../../../nodes/GraphQLCCIMSUser";

const createUserPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "CreateUserPayload",
    description: "The Payload/Response for the createUser mutation",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "The string provided by the client on sending the mutation"
        },
        user: {
            type: GraphQLCCIMSUser,
            description: "The user created by this mutation"
        }
    })
};
const GraphQLCreateUserPayload = new GraphQLObjectType(createUserPayloadConfig);
export default GraphQLCreateUserPayload;