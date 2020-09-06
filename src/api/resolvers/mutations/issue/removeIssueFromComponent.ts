import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLRemoveIssueFromComponentPayload from "../../types/mutations/payloads/issue/GraphQLRemoveIssueFromComponentPayload";
import GraphQLRemoveIssueFromComponentInput from "../../types/mutations/inputs/issue/GraphQLRemoveIssueFromComponentInput";

let removeIssueFromComponent: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (removeIssueFromComponent === undefined) {
        removeIssueFromComponent = {
            type: GraphQLRemoveIssueFromComponentPayload,
            description: "",
            args: {
                input: {
                    type: GraphQLRemoveIssueFromComponentInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return removeIssueFromComponent;
};