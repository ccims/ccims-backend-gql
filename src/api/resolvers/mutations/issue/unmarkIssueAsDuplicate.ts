import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLUnmarkIssueAsDuplicatePayload from "../../types/mutations/payloads/issue/GraphQLUnmarkIssueAsDuplicatePayload";
import GraphQLUnmarkIssueAsDuplicateInput from "../../types/mutations/inputs/issue/GraphQLUnmarkIssueAsDuplicateInput";

let unmarkIssueAsDuplicate: GraphQLFieldConfig<any, ResolverContext> | undefined;
export default () => {
    if (unmarkIssueAsDuplicate === undefined) {
        unmarkIssueAsDuplicate = {
            type: GraphQLUnmarkIssueAsDuplicatePayload,
            description: "Remove the marking on an issue that it is a duplicate of another issue",
            args: {
                input: {
                    type: GraphQLUnmarkIssueAsDuplicateInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return unmarkIssueAsDuplicate;
};