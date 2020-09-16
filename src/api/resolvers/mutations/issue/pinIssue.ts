import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLPinIssuePayload from "../../types/mutations/payloads/issue/GraphQLPinIssuePayload";
import GraphQLPinIssueInput from "../../types/mutations/inputs/issue/GraphQLPinIssueInput";

let pinIssue: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (pinIssue === undefined) {
        pinIssue = {
            type: GraphQLPinIssuePayload,
            description: "Pins an issue to a component (including in the IMS of the component)",
            args: {
                input: {
                    type: GraphQLPinIssueInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return pinIssue;
};