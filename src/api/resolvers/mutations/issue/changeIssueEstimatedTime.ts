import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLChangeIssueEstimatedTimePayload from "../../types/mutations/payloads/issue/GraphQLChangeIssueEstimatedTimePayload";
import GraphQLChangeIssueEstimatedTimeInput from "../../types/mutations/inputs/issue/GraphQLChangeIssueEstimatedTimeInput";

let changeIssueEstimatedTime: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (changeIssueEstimatedTime === undefined) {
        changeIssueEstimatedTime = {
            type: GraphQLChangeIssueEstimatedTimePayload,
            description: "Changes the set estimated time on an issue",
            args: {
                input: {
                    type: GraphQLChangeIssueEstimatedTimeInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return changeIssueEstimatedTime;
};