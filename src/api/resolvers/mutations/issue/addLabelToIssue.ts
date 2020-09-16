import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLAddLabelToIssuePayload from "../../types/mutations/payloads/issue/GraphQLAddLabelToIssuePayload";
import GraphQLAddLabelToIssueInput from "../../types/mutations/inputs/issue/GraphQLAddLabelToIssueInput";

let addLabelToIssue: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (addLabelToIssue === undefined) {
        addLabelToIssue = {
            type: GraphQLAddLabelToIssuePayload,
            description: "Adds a label to an issue",
            args: {
                input: {
                    type: GraphQLAddLabelToIssueInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return addLabelToIssue;
};