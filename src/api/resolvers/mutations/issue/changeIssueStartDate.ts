import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLChangeIssueStartDatePayload from "../../types/mutations/payloads/issue/GraphQLChangeIssueStartDatePayload";
import GraphQLChangeIssueStartDateInput from "../../types/mutations/inputs/issue/GraphQLChangeIssueStartDateInput";

let changeIssueStartDate: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (changeIssueStartDate === undefined) {
        changeIssueStartDate = {
            type: GraphQLChangeIssueStartDatePayload,
            description: "Changes the set start date on an issue",
            args: {
                input: {
                    type: GraphQLChangeIssueStartDateInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return changeIssueStartDate;
};