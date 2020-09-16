import { GraphQLInputFieldConfig, GraphQLInputObjectType, GraphQLInputObjectTypeConfig, GraphQLString, GraphQLID, GraphQLNonNull } from "graphql";
import GraphQLIssueCategory from "../../../../enums/GraphQLIssueCategory";

let changeIssueCategoryInputConfig: GraphQLInputObjectTypeConfig = {
    name: "ChangeIssueCategoryInput",
    description: "The inputs for the changeIssueCategory",
    fields: () => ({
        clientMutationID: {
            type: GraphQLString,
            description: "An arbitraty string to return together with the mutation result"
        },
        issue: {
            type: GraphQLNonNull(GraphQLID),
            description: "The ID of the for which to change the category"
        },
        newCategory: {
            type: GraphQLNonNull(GraphQLIssueCategory),
            description: "The new category to be set for the issue"
        }
    })
};
let GraphQLChangeIssueCategoryInput = new GraphQLInputObjectType(changeIssueCategoryInputConfig);
export default GraphQLChangeIssueCategoryInput;