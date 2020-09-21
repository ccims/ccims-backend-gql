import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLRemoveLabelFromIssuePayload from "../../types/mutations/payloads/issue/GraphQLRemoveLabelFromIssuePayload";
import GraphQLRemoveLabelFromIssueInput from "../../types/mutations/inputs/issue/GraphQLRemoveLabelFromIssueInput";

let removeLabelFromIssue: GraphQLFieldConfig<any, ResolverContext> | undefined;
export default () => {
    if (removeLabelFromIssue === undefined) {
        removeLabelFromIssue = {
            type: GraphQLRemoveLabelFromIssuePayload,
            description: "Remove a label that is currently on the issue",
            args: {
                input: {
                    type: GraphQLRemoveLabelFromIssueInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return removeLabelFromIssue;
};