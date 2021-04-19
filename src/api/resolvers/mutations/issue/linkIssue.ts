import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLLinkIssuePayload from "../../types/mutations/payloads/issue/GraphQLLinkIssuePayload";
import GraphQLLinkIssueInput from "../../types/mutations/inputs/issue/GraphQLLinkIssueInput";
import timelineMutation from "./timelineMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import { Issue } from "../../../../common/nodes/Issue";

function linkIssue(): GraphQLFieldConfig<any, ResolverContext> {
    const base = timelineMutation(GraphQLLinkIssuePayload, GraphQLLinkIssueInput, "Links an issue to another one, creating a relation. It is not possible to link an Issue to itself.");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const { input, cmd } = base.initTimelineMutation(args, context);
            const issueToLinkId = PreconditionCheck.checkString(input, "issueToLink", 32);

            const issue = await base.getIssue(cmd, context, (perm, issueObj) => perm.componentAdmin || perm.moderate || (perm.editIssues && issueObj.createdByProperty.getId() === context.user.id));
            
            const issueToLink = await context.dbManager.getNode(issueToLinkId);
            if (issueToLink === undefined || !(issueToLink instanceof Issue)) {
                throw new Error("The specified issueToLink id is not the id of a valid Issue");
            }
            if (issue.id === issueToLink.id) {
                throw new Error("Cannot link Issue to itself");
            }

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
