import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLAddReactionToCommentPayload from "../../types/mutations/payloads/issue/GraphQLAddReactionToCommentPayload";
import GraphQLAddReactionToCommentInput from "../../types/mutations/inputs/issue/GraphQLAddReactionToCommentInput";

let addReactionToComment: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (addReactionToComment === undefined) {
        addReactionToComment = {
            type: GraphQLAddReactionToCommentPayload,
            description: "",
            args: {
                input: {
                    type: GraphQLAddReactionToCommentInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return addReactionToComment;
};