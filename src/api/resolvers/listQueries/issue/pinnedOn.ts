import { GraphQLFieldConfig, GraphQLString, GraphQLInt } from "graphql";
import GraphQLIssueFilter from "../../types/filters/GraphQLIssueFilter";
import GraphQLIssuePage from "../../types/pages/GraphQLIssuePage";
import GraphQLComponentPage from "../../types/pages/GraphQLComponentPage";
import GraphQLComponentFilter from "../../types/filters/GraphQLComponentFilter";

let pinnedOn: GraphQLFieldConfig<any, any, any> | undefined = undefined;
export default () => {
    if (pinnedOn === undefined) {
        pinnedOn = {
            type: GraphQLComponentPage,
            description: `All components where this issue has been pinned, matching the given filter.\n
            If no filter is given, all components will be returned`,
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
    }
    return pinnedOn;
};