import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLRemoveReactionPayload from "../../types/mutations/payloads/issue/GraphQLRemoveReactionPayload";
import GraphQLRemoveReactionInput from "../../types/mutations/inputs/issue/GraphQLRemoveReactionInput";

let removeReaction: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (removeReaction === undefined) {
        removeReaction = {
            type: GraphQLRemoveReactionPayload,
            description: "",
            args: {
                input: {
                    type: GraphQLRemoveReactionInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return removeReaction;
};