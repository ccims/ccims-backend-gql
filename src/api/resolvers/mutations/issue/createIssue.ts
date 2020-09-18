import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLCreateIssuePayload from "../../types/mutations/payloads/issue/GraphQLCreateIssuePayload";
import GraphQLCreateIssueInput from "../../types/mutations/inputs/issue/GraphQLCreateIssueInput";

let createIssue: GraphQLFieldConfig<any, ResolverContext> | undefined;
export default () => {
    if (createIssue === undefined) {
        createIssue = {
            type: GraphQLCreateIssuePayload,
            description: "Creates a new Issue",
            args: {
                input: {
                    type: GraphQLCreateIssueInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return createIssue;
};