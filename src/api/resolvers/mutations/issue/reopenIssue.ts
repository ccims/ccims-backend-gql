import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLReopenIssuePayload from "../../types/mutations/payloads/issue/GraphQLReopenIssuePayload";
import GraphQLReopenIssueInput from "../../types/mutations/inputs/issue/GraphQLReopenIssueInput";

let reopenIssue: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (reopenIssue === undefined) {
        reopenIssue = {
            type: GraphQLReopenIssuePayload,
            description: "",
            args: {
                input: {
                    type: GraphQLReopenIssueInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return reopenIssue;
};