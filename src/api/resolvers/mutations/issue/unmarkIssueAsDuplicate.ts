import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLUnmarkIssueAsDuplicatePayload from "../../types/mutations/payloads/issue/GraphQLUnmarkIssueAsDuplicatePayload";
import GraphQLUnmarkIssueAsDuplicateInput from "../../types/mutations/inputs/issue/GraphQLUnmarkIssueAsDuplicateInput";

let unmarkIssueAsDuplicate: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (unmarkIssueAsDuplicate === undefined) {
        unmarkIssueAsDuplicate = {
            type: GraphQLUnmarkIssueAsDuplicatePayload,
            description: "",
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