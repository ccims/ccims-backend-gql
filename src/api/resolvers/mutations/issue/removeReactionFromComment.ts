import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLRemoveReactionFromCommentPayload from "../../types/mutations/payloads/issue/GraphQLRemoveReactionFromCommentPayload";
import GraphQLRemoveReactionFromCommentInput from "../../types/mutations/inputs/issue/GraphQLRemoveReactionFromCommentInput";

let removeReactionFromComment: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (removeReactionFromComment === undefined) {
        removeReactionFromComment = {
            type: GraphQLRemoveReactionFromCommentPayload,
            description: "",
            args: {
                input: {
                    type: GraphQLRemoveReactionFromCommentInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return removeReactionFromComment;
};