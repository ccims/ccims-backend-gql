import { GraphQLSchema, GraphQLObjectType } from "graphql"
import { ResolverContext } from "../ResolverContext";
import registerUser from "./mutations/registerUser";
import GraphQLRegisterUserPayload from "./types/mutations/payloads/GraphQLRegisterUserPayload";
import GraphQLRegisterUserInput from "./types/mutations/inputs/GraphQLRegisterUserInput";
import checkUsername from "./query/checkUsername";

const publicScimsSchema = new GraphQLSchema({
    types: [GraphQLRegisterUserPayload, GraphQLRegisterUserInput],
    mutation: new GraphQLObjectType<any, ResolverContext>({
        name: "Mutation",
        description: "Mutations which are public and don't require authentication",
        fields: () => ({
            registerUser: registerUser()
        })
    }),
    query: new GraphQLObjectType<any, ResolverContext>({
        name: "Query",
        description: "Queries which are public and don't require authentication",
        fields: () => ({
            checkUsername: checkUsername()
        })
    })
});
export default publicScimsSchema;
