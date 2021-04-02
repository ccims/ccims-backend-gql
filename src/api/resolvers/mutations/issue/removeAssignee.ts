import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLRemoveAssigneePayload from "../../types/mutations/payloads/issue/GraphQLRemoveAssigneePayload";
import GraphQLRemoveAssigneeInput from "../../types/mutations/inputs/issue/GraphQLRemoveAssigneeInput";
import timelineMutation from "./timelineMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import { LoadUsersCommand } from "../../../../common/database/commands/load/nodes/LoadUsersCommandBase";

function removeAssignee(): GraphQLFieldConfig<any, ResolverContext> {
    const base = timelineMutation(GraphQLRemoveAssigneePayload, GraphQLRemoveAssigneeInput, "Unassignes a user that is currently an assinee on an issue");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const { cmd, input } = base.initTimelineMutation(args, context);
            const userId = PreconditionCheck.checkString(input, "user", 32);

            const userCmd = new LoadUsersCommand();
            userCmd.ids = [userId];
            context.dbManager.addCommand(userCmd);

            const issue = await base.getIssue(cmd, context, (perm, issueObj) => perm.componentAdmin || perm.editIssues || perm.moderate);

            if (userCmd.getResult().length !== 1) {
                throw new Error(`The given id is no valid user id`);
            }
            const user = userCmd.getResult()[0];

            const event = await issue.unassignUser(user, new Date(), context.user);
            await context.dbManager.save();
            return base.createResult(args, issue, event, { user });
        }
    }
}
export default removeAssignee;