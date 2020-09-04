import { GraphQLFieldConfig, GraphQLString, GraphQLInt } from "graphql";
import GraphQLIssueFilter from "../../types/filters/GraphQLIssueFilter";
import GraphQLIssuePage from "../../types/pages/GraphQLIssuePage";
import GraphQLReactionGroupFilter from "../../types/filters/GraphQLReactionGroupFilter";
import GraphQLReactionGroupPage from "../../types/pages/GraphQLReactionGroupPage";

let reactions: GraphQLFieldConfig<any, any, any> = {
    type: GraphQLReactionGroupPage,
    description: `All reactions on this node, matching the given filter.\n
    If no filter is given, all reactions will be returned`,
    args: {
        after: {
            type: GraphQLString,
            description: "Return only reactions AFTER the one with the specified cursor (exclusive)"
        },
        before: {
            type: GraphQLString,
            description: "Return only reactions BEFORE the one with the specified cursor (exclusive)"
        },
        filterBy: {
            type: GraphQLReactionGroupFilter,
            description: "Return only reactions matching this filter"
        },
        first: {
            type: GraphQLInt,
            description: "Return at most the first n reactions"
        },
        last: {
            type: GraphQLInt,
            description: "Return at most the last n reactions"
        }
    }
};
export default reactions;