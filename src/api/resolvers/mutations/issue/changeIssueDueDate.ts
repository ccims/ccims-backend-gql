import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLChangeIssueDueDatePayload from "../../types/mutations/payloads/issue/GraphQLChangeIssueDueDatePayload";
import GraphQLChangeIssueDueDateInput from "../../types/mutations/inputs/issue/GraphQLChangeIssueDueDateInput";

let changeIssueDueDate: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (changeIssueDueDate === undefined) {
        changeIssueDueDate = {
            type: GraphQLChangeIssueDueDatePayload,
            description: "Changes the set due date on an issue",
            args: {
                input: {
                    type: GraphQLChangeIssueDueDateInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return changeIssueDueDate;
};