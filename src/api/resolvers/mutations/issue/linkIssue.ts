import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLLinkIssuePayload from "../../types/mutations/payloads/issue/GraphQLLinkIssuePayload";
import GraphQLLinkIssueInput from "../../types/mutations/inputs/issue/GraphQLLinkIssueInput";

let linkIssue: GraphQLFieldConfig<any, ResolverContext> | undefined;
export default () => {
    if (linkIssue === undefined) {
        linkIssue = {
            type: GraphQLLinkIssuePayload,
            description: "Links an issue to another one, creating a relation",
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