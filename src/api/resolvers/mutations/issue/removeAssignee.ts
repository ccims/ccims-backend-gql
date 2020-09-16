import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLRemoveAssigneePayload from "../../types/mutations/payloads/issue/GraphQLRemoveAssigneePayload";
import GraphQLRemoveAssigneeInput from "../../types/mutations/inputs/issue/GraphQLRemoveAssigneeInput";

let removeAssignee: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (removeAssignee === undefined) {
        removeAssignee = {
            type: GraphQLRemoveAssigneePayload,
            description: "Uassignes a user that is currently an assinee on an issue",
            args: {
                input: {
                    type: GraphQLRemoveAssigneeInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return removeAssignee;
};