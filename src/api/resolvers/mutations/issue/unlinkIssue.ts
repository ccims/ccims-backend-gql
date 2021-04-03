import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import timelineMutation from "./timelineMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import { LoadIssuesCommand } from "../../../../common/database/commands/load/nodes/LoadIssuesCommand";
import GraphQLUnlinkIssuePayload from "../../types/mutations/payloads/issue/GraphQLUnlinkIssuePayload";
import GraphQLUnlinkIssueInput from "../../types/mutations/inputs/issue/GraphQLUnlinkIssueInput";

function unlinkIssue(): GraphQLFieldConfig<any, ResolverContext> {
    const base = timelineMutation(GraphQLUnlinkIssuePayload, GraphQLUnlinkIssueInput, "Unlinks an issue from another one, removing a relation");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const { input, cmd } = base.initTimelineMutation(args, context);
            const issueToUnlinkId = PreconditionCheck.checkString(input, "issueToUnlink", 32);
            const issueToUnlinkCmd = new LoadIssuesCommand();
            issueToUnlinkCmd.ids = [issueToUnlinkId];
            context.dbManager.addCommand(issueToUnlinkCmd);
            const issue = await base.getIssue(cmd, context, (perm, issueObj) => perm.componentAdmin || perm.moderate || (perm.editIssues && issueObj.createdByProperty.getId() === context.user.id));
            if (issueToUnlinkCmd.getResult().length !== 1) {
                throw new Error("The given id for the issue to unlink TO was no valid issue id");
            }
            const issueToUnlink = issueToUnlinkCmd.getResult()[0];
            /*
            if (!context.user.permissions.globalPermissions.globalAdmin && !(await issue.componentsProperty.getIds()).some(id => {
                const perm = context.user.permissions.getComponentPermissions(id);
                return perm.componentAdmin || perm.linkIssues
            })) {
                throw new Error("You must be allowed to unlink issues on at least on of the components the issue is on");
            }
            */
            const event = await issue.removeLinkedIssue(issueToUnlink, new Date(), context.user);
            await context.dbManager.save();
            return base.createResult(args, issue, event, {});
        }
    }
}
export default unlinkIssue;
