import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLDeleteIssueCommentPayload from "../../types/mutations/payloads/issue/GraphQLDeleteIssueCommentPayload";
import GraphQLDeleteIssueCommentInput from "../../types/mutations/inputs/issue/GraphQLDeleteIssueCommentInput";

let deleteIssueComment: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (deleteIssueComment === undefined) {
        deleteIssueComment = {
            type: GraphQLDeleteIssueCommentPayload,
            description: "",
            args: {
                input: {
                    type: GraphQLDeleteIssueCommentInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return deleteIssueComment;
};