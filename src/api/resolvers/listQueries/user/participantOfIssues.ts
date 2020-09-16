import { GraphQLFieldConfig, GraphQLInt, GraphQLString } from "graphql";
import GraphQLIssueFilter from "../../types/filters/GraphQLIssueFilter";
import GraphQLIssuePage from "../../types/pages/GraphQLIssuePage";

let participantOfIssues: GraphQLFieldConfig<any, any, any> | undefined = undefined;
export default () => {
    if (participantOfIssues === undefined) {
        participantOfIssues = {
            type: GraphQLIssuePage,
            description: "Returns all issues this user is a participant of (e.g. through contibuting, being assigned etc.)",
            args: {
                after: {
                    type: GraphQLString,
                    description: "Return only issues AFTER the one with the specified cursor (exclusive)"
                },
                before: {
                    type: GraphQLString,
                    description: "Return only issues BEFORE the one with the specified cursor (exclusive)"
                },
                filterBy: {
                    type: GraphQLIssueFilter,
                    description: "Return only issues matching this filter"
                },
                first: {
                    type: GraphQLInt,
                    description: "Return at most the first n issues"
                },
                last: {
                    type: GraphQLInt,
                    description: "Return at most the last n issues"
                }
            }
        };
    }
    return participantOfIssues;
};