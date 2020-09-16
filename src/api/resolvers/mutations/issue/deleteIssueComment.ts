import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLDeleteIssueCommentPayload from "../../types/mutations/payloads/issue/GraphQLDeleteIssueCommentPayload";
import GraphQLDeleteIssueCommentInput from "../../types/mutations/inputs/issue/GraphQLDeleteIssueCommentInput";

let deleteIssueComment: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (deleteIssueComment === undefined) {
        deleteIssueComment = {
            type: GraphQLDeleteIssueCommentPayload,
            description: "Deletes an issue comment.\n\nComments don't get fully deleted but replaced by a\n\n`DeletedComment` (only contains creation/deletion date/user) which is for conversation completness",
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