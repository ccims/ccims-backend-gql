import { GraphQLObjectType, GraphQLString } from "graphql";
import testMutation from "./mutations/testMutation";
export default new GraphQLObjectType({
    name: "Mutation",
    description: "Mutations to change the data within the ccims",
    fields: {
        testMutation
    }
});