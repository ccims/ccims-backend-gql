import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import baseMutation from "../baseMutation";
import GraphQLAddAssigneePayload from "../../types/mutations/payloads/issue/GraphQLAddAssigneePayload";
import GraphQLAddAssigneeInput from "../../types/mutations/inputs/issue/GraphQLAddAssigneeInput";
import PreconditionCheck from "../../utils/PreconditionCheck";
import { LoadUsersCommand } from "../../../../common/database/commands/load/nodes/LoadUsersCommand";
import { LoadIssuesCommand } from "../../../../common/database/commands/load/nodes/LoadIssuesCommand";
import timelineMutation from "./timelineMutation";

function addAssignee(): GraphQLFieldConfig<any, ResolverContext> {
    const base = timelineMutation(GraphQLAddAssigneePayload, GraphQLAddAssigneeInput, "Adds a user as assignee to the issue");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const { cmd, input } = base.initTimelineMutation(args, context);
            const userId = PreconditionCheck.checkString(input, "userToAssign", 32);

            const userCmd = new LoadUsersCommand();
            userCmd.ids = [userId];
            context.dbManager.addCommand(userCmd);

            const issue = await base.getIssue(cmd, context, (perm, issueObj) => perm.componentAdmin || (perm.editIssues && issueObj.createdByProperty.getId() === context.user.id) || perm.moderate);

            if (userCmd.getResult().length !== 1) {
                throw new Error(`The given id is no valid user id`);
            }
            const user = userCmd.getResult()[0];

            const event = await issue.assignUser(user, new Date(), context.user);
            await context.dbManager.save();
            return base.createResult(args, issue, event, { assignee: user });
        }
    }
}
export default addAssignee;