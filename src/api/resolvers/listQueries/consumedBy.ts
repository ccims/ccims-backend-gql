import { GraphQLFieldConfig, GraphQLString, GraphQLInt } from "graphql";
import GraphQLComponentPage from "../types/pages/GraphQLComponentPage";
import GraphQLComponentFilter from "../types/filters/GraphQLComponentFilter";

let consumedBy: GraphQLFieldConfig<any, any, any> = {
    type: GraphQLComponentPage,
    description: "Components which consume the interface and match the filter.\n\nIf no filter is given, all components will be returned",
    args: {
        after: {
            type: GraphQLString,
            description: "Return only components AFTER the one with the specified cursor (exclusive)"
        },
        before: {
            type: GraphQLString,
            description: "Return only components BEFORE the one with the specified cursor (exclusive)"
        },
        filterBy: {
            type: GraphQLComponentFilter,
            description: "Return only components matching this filter"
        },
        first: {
            type: GraphQLInt,
            description: "Return at most the first n components"
        },
        last: {
            type: GraphQLInt,
            description: "Return at most the last n components"
        }
    }
};

export default consumedBy;