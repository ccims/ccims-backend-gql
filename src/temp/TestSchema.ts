import { GraphQLSchema } from "graphql";
import TestQueries from "./TestQueries";

let testSchema = new GraphQLSchema({
    query: TestQueries
});
export default testSchema;