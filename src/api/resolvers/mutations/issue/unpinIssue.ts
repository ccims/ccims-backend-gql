import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLUnpinIssuePayload from "../../types/mutations/payloads/issue/GraphQLUnpinIssuePayload";
import GraphQLUnpinIssueInput from "../../types/mutations/inputs/issue/GraphQLUnpinIssueInput";

let unpinIssue: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (unpinIssue === undefined) {
        unpinIssue = {
            type: GraphQLUnpinIssuePayload,
            description: "",
            args: {
                input: {
                    type: GraphQLUnpinIssueInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return unpinIssue;
};