import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLRemoveIssueFromLocationPayload from "../../types/mutations/payloads/issue/GraphQLRemoveIssueFromLocationPayload";
import GraphQLRemoveIssueFromLocationInput from "../../types/mutations/inputs/issue/GraphQLRemoveIssueFromLocationInput";

let removeIssueFromLocation: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (removeIssueFromLocation === undefined) {
        removeIssueFromLocation = {
            type: GraphQLRemoveIssueFromLocationPayload,
            description: "",
            args: {
                input: {
                    type: GraphQLRemoveIssueFromLocationInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return removeIssueFromLocation;
};