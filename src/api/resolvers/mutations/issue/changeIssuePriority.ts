import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLChangeIssuePriorityPayload from "../../types/mutations/payloads/issue/GraphQLChangeIssuePriorityPayload";
import GraphQLChangeIssuePriorityInput from "../../types/mutations/inputs/issue/GraphQLChangeIssuePriorityInput";

let changeIssuePriority: GraphQLFieldConfig<any, ResolverContext> | undefined;
export default () => {
    if (changeIssuePriority === undefined) {
        changeIssuePriority = {
            type: GraphQLChangeIssuePriorityPayload,
            description: "Changes the priority of an issue",
            args: {
                input: {
                    type: GraphQLChangeIssuePriorityInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return changeIssuePriority;
};