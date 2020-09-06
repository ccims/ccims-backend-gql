import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLLinkIssuePayload from "../../types/mutations/payloads/issue/GraphQLLinkIssuePayload";
import GraphQLLinkIssueInput from "../../types/mutations/inputs/issue/GraphQLLinkIssueInput";

let linkIssue: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (linkIssue === undefined) {
        linkIssue = {
            type: GraphQLLinkIssuePayload,
            description: "",
            args: {
                input: {
                    type: GraphQLLinkIssueInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return linkIssue;
};