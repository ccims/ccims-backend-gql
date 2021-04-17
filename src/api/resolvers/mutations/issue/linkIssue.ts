import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLLinkIssuePayload from "../../types/mutations/payloads/issue/GraphQLLinkIssuePayload";
import GraphQLLinkIssueInput from "../../types/mutations/inputs/issue/GraphQLLinkIssueInput";
import timelineMutation from "./timelineMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import { LoadIssuesCommand } from "../../../../common/database/commands/load/nodes/LoadIssuesCommand";

function linkIssue(): GraphQLFieldConfig<any, ResolverContext> {
    const base = timelineMutation(GraphQLLinkIssuePayload, GraphQLLinkIssueInput, "Links an issue to another one, creating a relation");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const { input, cmd } = base.initTimelineMutation(args, context);
            const issueToLinkId = PreconditionCheck.checkString(input, "issueToLink", 32);
            const issueToLinkCmd = new LoadIssuesCommand();
            issueToLinkCmd.ids = [issueToLinkId];
            context.dbManager.addCommand(issueToLinkCmd);
            const issue = await base.getIssue(cmd, context, (perm, issueObj) => perm.componentAdmin || perm.moderate || (perm.editIssues && issueObj.createdByProperty.getId() === context.user.id));
            if (issueToLinkCmd.getResult().length !== 1) {
                throw new Error("The given id for the issue to link TO was no valid issue id");
            }
            const issueToLink = issueToLinkCmd.getResult()[0];
            /*
            if (!context.user.permissions.globalPermissions.globalAdmin && !(await issue.componentsProperty.getIds()).some(id => {
                const perm = context.user.permissions.getComponentPermissions(id);
                return perm.componentAdmin || perm.linkIssues
            })) {
                throw new Error("You must be allowed to link issues on at least on of the components the issue is on");
            }
            */
            const event = await issue.addLinkedIssue(issueToLink, new Date(), context.user);
            return base.createResult(args, context, issue, event, { linkedIssue: issueToLink });
        }
    }
}
export default linkIssue;
