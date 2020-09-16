import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLAddAssigneePayload from "../../types/mutations/payloads/issue/GraphQLAddAssigneePayload";
import GraphQLAddAssigneeInput from "../../types/mutations/inputs/issue/GraphQLAddAssigneeInput";

let addAssignee: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (addAssignee === undefined) {
        addAssignee = {
            type: GraphQLAddAssigneePayload,
            description: "Assignes a user to an issue",
            args: {
                input: {
                    type: GraphQLAddAssigneeInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return addAssignee;
};