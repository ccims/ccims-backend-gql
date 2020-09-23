import { GraphQLObjectTypeConfig, GraphQLObjectType, GraphQLString, GraphQLID } from "graphql";
import { ResolverContext } from "../../../../ResolverContext";

const registerUserPayloadConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "RegisterUserPayload",
    description: "The Payload/Response for the public registerUser mutation",
    fields: () => ({
        userId: {
            type: GraphQLID,
            description: "The ID of the user created by this mutation"
        }
    })
};
const GraphQLRegisterUserPayload = new GraphQLObjectType(registerUserPayloadConfig);
export default GraphQLRegisterUserPayload;