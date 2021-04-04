import typeImports from "./typeImports";
import { GraphQLSchema } from "graphql"
import mutation from "./mutation";
import query from "./query";

const ccimsSchema = new GraphQLSchema({
    types: typeImports,
    mutation,
    query
});
export default ccimsSchema;
