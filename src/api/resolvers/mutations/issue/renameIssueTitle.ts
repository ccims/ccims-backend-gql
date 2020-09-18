import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLRenameIssueTitlePayload from "../../types/mutations/payloads/issue/GraphQLRenameIssueTitlePayload";
import GraphQLRenameIssueTitleInput from "../../types/mutations/inputs/issue/GraphQLRenameIssueTitleInput";

let renameIssueTitle: GraphQLFieldConfig<any, ResolverContext> | undefined;
export default () => {
    if (renameIssueTitle === undefined) {
        renameIssueTitle = {
            type: GraphQLRenameIssueTitlePayload,
            description: "Change the title (rename) an issue",
            args: {
                input: {
                    type: GraphQLRenameIssueTitleInput,
                    description: "The data for the mutation"
                }
            }
        };
    }
    return renameIssueTitle;
};