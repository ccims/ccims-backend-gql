import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLAddIssueToComponentPayload from "../../types/mutations/payloads/issue/GraphQLAddIssueToComponentPayload";
import GraphQLAddIssueToComponentInput from "../../types/mutations/inputs/issue/GraphQLAddIssueToComponentInput";

let addIssueToComponent: GraphQLFieldConfig<any, ResolverContext> | undefined = undefined;
export default () => {
    if (addIssueToComponent === undefined) {
        addIssueToComponent = {
            type: GraphQLAddIssueToComponentPayload,
            description: "",
            args: {
                input: {
                    type: GraphQLAddIssueToComponentInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return addIssueToComponent;
};