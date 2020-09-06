import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLAddReactionPayload from "../../types/mutations/payloads/issue/GraphQLAddReactionPayload";
import GraphQLAddReactionInput from "../../types/mutations/inputs/issue/GraphQLAddReactionInput";

let addReaction: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (addReaction === undefined) {
        addReaction = {
            type: GraphQLAddReactionPayload,
            description: "",
            args: {
                input: {
                    type: GraphQLAddReactionInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return addReaction;
};