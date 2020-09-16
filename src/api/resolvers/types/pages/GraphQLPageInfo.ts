import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLBoolean, GraphQLObjectTypeConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";

let pageInfoConfig: GraphQLObjectTypeConfig<any, ResolverContext> = {
    name: "PageInfo",
    description: "Information about a page including the first and last elements cursor and next/previous pages",
    fields: () => ({
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
    })
};
let GraphQLPageInfo = new GraphQLObjectType(pageInfoConfig);
export default GraphQLPageInfo;