import { GraphQLSchema } from "graphql"
import mutation from "./mutation";
import query from "./query";
import typeImports from "./typeImports";

let ccimsSchema = new GraphQLSchema({
    types: typeImports,
    mutation,
    query
});
export default ccimsSchema;
