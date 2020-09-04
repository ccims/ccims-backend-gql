import { GraphQLObjectType } from "graphql";
import Element1 from "./Element1";
import Element2 from "./Element2";

const query = new GraphQLObjectType({
    name: "Query",
    description: "All queries for requesting stuff",
    fields: {
        elements1: {
            type: Element1
        }
    }
});

export default query;