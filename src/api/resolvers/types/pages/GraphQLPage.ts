import { GraphQLInterfaceType, GraphQLNonNull, GraphQLInt } from "graphql";

export default new GraphQLInterfaceType({
    name: "Page",
    description: "A page of elements\n\nContains edges and nodes as well as some information and a node count",
    fields: {
        pageInfo: {
            type: GraphQLNonNull(GraphQLPageInfo),
            description: "Information about the current page (like length, first/last element)"
        },
        totalCount: {
            type: GraphQLNonNull(GraphQLInt),
            description: "The total number of elements matching the filter\n\n(Even ones that don't match the current page)"
        }
    }
});