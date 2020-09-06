import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLAddIssueCommentPayload from "../../types/mutations/payloads/issue/GraphQLAddIssueCommentPayload";
import GraphQLAddIssueCommentInput from "../../types/mutations/inputs/issue/GraphQLAddIssueCommentInput";

let addIssueComment: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (addIssueComment === undefined) {
        addIssueComment = {
            type: GraphQLAddIssueCommentPayload,
            description: "",
            args: {
                input: {
                    type: GraphQLAddIssueCommentInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return addIssueComment;
};