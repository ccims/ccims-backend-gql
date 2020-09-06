import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLRemoveLabelPayload from "../../types/mutations/payloads/issue/GraphQLRemoveLabelPayload";
import GraphQLRemoveLabelInput from "../../types/mutations/inputs/issue/GraphQLRemoveLabelInput";

let removeLabel: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (removeLabel === undefined) {
        removeLabel = {
            type: GraphQLRemoveLabelPayload,
            description: "",
            args: {
                input: {
                    type: GraphQLRemoveLabelInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return removeLabel;
};