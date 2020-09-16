import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLAddIssueToLocationPayload from "../../types/mutations/payloads/issue/GraphQLAddIssueToLocationPayload";
import GraphQLAddIssueToLocationInput from "../../types/mutations/inputs/issue/GraphQLAddIssueToLocationInput";

let addIssueToLocation: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (addIssueToLocation === undefined) {
        addIssueToLocation = {
            type: GraphQLAddIssueToLocationPayload,
            description: "Adds an issue to a location (component or interface)",
            args: {
                input: {
                    type: GraphQLAddIssueToLocationInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return addIssueToLocation;
};