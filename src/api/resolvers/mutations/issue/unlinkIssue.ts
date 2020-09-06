import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLUnlinkIssuePayload from "../../types/mutations/payloads/issue/GraphQLUnlinkIssuePayload";
import GraphQLUnlinkIssueInput from "../../types/mutations/inputs/issue/GraphQLUnlinkIssueInput";

let unlinkIssue: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (unlinkIssue === undefined) {
        unlinkIssue = {
            type: GraphQLUnlinkIssuePayload,
            description: "",
            args: {
                input: {
                    type: GraphQLUnlinkIssueInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return unlinkIssue;
};