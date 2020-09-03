import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLBoolean } from "graphql";

export default new GraphQLObjectType({
    name: "PageInfo",
    description: "Information about a page including the first and last elements cursor and next/previous pages",
    fields: {
        startCursor: {
            type: GraphQLString,
            description: "The cursor of the first element on the page. Can be used to request the previous page."
        },
        endCursor: {
            type: GraphQLString,
            description: "The cursor of the last element on the page. Can be used to request the next page."
        },
        hasNextPage: {
            type: GraphQLNonNull(GraphQLBoolean),
            description: "true iff there is another page of elements with the current filter"
        },
        hasPreviousPage: {
            type: GraphQLNonNull(GraphQLBoolean),
            description: "true iff there is a previous page of elements with the current filter"
        }
    }
});