import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLRenameIssueTitlePayload from "../../types/mutations/payloads/issue/GraphQLRenameIssueTitlePayload";
import GraphQLRenameIssueTitleInput from "../../types/mutations/inputs/issue/GraphQLRenameIssueTitleInput";
import timelineMutation from "./timelineMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";

function renameIssueTitle(): GraphQLFieldConfig<any, ResolverContext> {
    const base = timelineMutation(GraphQLRenameIssueTitlePayload, GraphQLRenameIssueTitleInput, "Change the title (rename) an issue");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const { input, cmd } = base.initTimelineMutation(args, context);
            const title = PreconditionCheck.checkString(input, "newTitle", 256);
            if (title.length <= 0) {
                throw new Error("The title text can't be empty");
            }
            const issue = await base.getIssue(cmd, context, (perm, issueObj) => perm.componentAdmin || perm.moderate || (perm.editIssues && issueObj.createdByProperty.getId() === context.user.id));
            const event = await issue.changeTitle(title, new Date(), context.user);
            return base.createResult(args, context, issue, event, {});
        }
    }
}
export default renameIssueTitle;