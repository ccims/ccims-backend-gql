import { GraphQLFieldConfig, GraphQLString, GraphQLInt } from "graphql";
import GraphQLLabelPage from "../types/pages/GraphQLLabelPage";
import GraphQLLabelFilter from "../types/filters/GraphQLLabelFilter";

let labels: GraphQLFieldConfig<any, any, any> | undefined = undefined;
export default () => {
    if (labels === undefined) {
        labels = {
            type: GraphQLLabelPage,
            description: `All labels which are available on this project, matching the given filter.\n
            If no filter is given, all labels will be returned`,
            args: {
                after: {
                    type: GraphQLString,
                    description: "Return only labels AFTER the one with the specified cursor (exclusive)"
                },
                before: {
                    type: GraphQLString,
                    description: "Return only labels BEFORE the one with the specified cursor (exclusive)"
                },
                filterBy: {
                    type: GraphQLLabelFilter,
                    description: "Return only labels matching this filter"
                },
                first: {
                    type: GraphQLInt,
                    description: "Return at most the first n labels"
                },
                last: {
                    type: GraphQLInt,
                    description: "Return at most the last n labels"
                }
            }
        }
    }
    return labels;
};