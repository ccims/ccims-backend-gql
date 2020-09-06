import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";
import TestQueries from "./TestQueries";

let testSchema = new GraphQLSchema({
    mutation: TestQueries,
    query: new GraphQLObjectType({
        name: "Query",
        fields: {
            test: {
                type: GraphQLString,
            }
        }
    })
});
export default testSchema;