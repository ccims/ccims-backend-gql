import { GraphQLEnumType, GraphQLEnumTypeConfig } from "graphql";

let issueCategoryConfig: GraphQLEnumTypeConfig = {
    name: "IssueCategory",
    description: "The category of an issue. The issue will be displayed accordingly in the ccims",
    values: {
        BUG: {
            value: "BUG",
            description: "If an issue is classified _bug_ it describes an error, flaw or fault in one ore multiple component(s) or interface(s)"
        },
        FEATURE_REQUEST: {
            value: "FEATURE_REQUEST",
            description: "If an issue is defined a _feature request_, it describes a functionality that is to be implemented at some point"
        },
        UNCLASSIFIED: {
            value: "UNCLASSIFIED",
            description: "The category for issues, that either weren't yet assigned to a category or that don't fit into one of the other categories"
        }
    }
};
let GraphQLIssueCategory = new GraphQLEnumType(issueCategoryConfig);
export default GraphQLIssueCategory;