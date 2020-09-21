import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLChangeIssueCategoryPayload from "../../types/mutations/payloads/issue/GraphQLChangeIssueCategoryPayload";
import GraphQLChangeIssueCategoryInput from "../../types/mutations/inputs/issue/GraphQLChangeIssueCategoryInput";

let changeIssueCategory: GraphQLFieldConfig<any, ResolverContext> | undefined;
export default () => {
    if (changeIssueCategory === undefined) {
        changeIssueCategory = {
            type: GraphQLChangeIssueCategoryPayload,
            description: "Changes the category of an issue",
            args: {
                input: {
                    type: GraphQLChangeIssueCategoryInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return changeIssueCategory;
};