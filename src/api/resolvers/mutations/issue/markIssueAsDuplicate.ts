import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLMarkIssueAsDuplicatePayload from "../../types/mutations/payloads/issue/GraphQLMarkIssueAsDuplicatePayload";
import GraphQLMarkIssueAsDuplicateInput from "../../types/mutations/inputs/issue/GraphQLMarkIssueAsDuplicateInput";

let markIssueAsDuplicate: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (markIssueAsDuplicate === undefined) {
        markIssueAsDuplicate = {
            type: GraphQLMarkIssueAsDuplicatePayload,
            description: "",
            args: {
                input: {
                    type: GraphQLMarkIssueAsDuplicateInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return markIssueAsDuplicate;
};