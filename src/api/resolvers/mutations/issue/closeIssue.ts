import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLCloseIssuePayload from "../../types/mutations/payloads/issue/GraphQLCloseIssuePayload";
import GraphQLCloseIssueInput from "../../types/mutations/inputs/issue/GraphQLCloseIssueInput";

let closeIssue: GraphQLFieldConfig<any, ResolverContext> | undefined;
export default () => {
    if (closeIssue === undefined) {
        closeIssue = {
            type: GraphQLCloseIssuePayload,
            description: "Closes an open issue",
            args: {
                input: {
                    type: GraphQLCloseIssueInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return closeIssue;
};