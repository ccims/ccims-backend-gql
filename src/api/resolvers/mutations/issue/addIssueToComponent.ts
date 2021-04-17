import { GraphQLFieldConfig } from "graphql";
import { LoadComponentsCommand } from "../../../../common/database/commands/load/nodes/LoadComponentsCommand";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLAddIssueToComponentInput from "../../types/mutations/inputs/issue/GraphQLAddIssueToComponentInput";
import GraphQLAddIssueToComponentPayload from "../../types/mutations/payloads/issue/GraphQLAddIssueToComponentPayload";
import PreconditionCheck from "../../utils/PreconditionCheck";
import timelineMutation from "./timelineMutation";

function addIssueToComponent(): GraphQLFieldConfig<any, ResolverContext> {
    const base = timelineMutation(GraphQLAddIssueToComponentPayload, GraphQLAddIssueToComponentInput, "Adds an issue to a component (including creating the issue on the ims of the component)");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const { cmd, input } = base.initTimelineMutation(args, context);
            const componentId = PreconditionCheck.checkString(input, "component", 32);
            const componentCmd = new LoadComponentsCommand();
            componentCmd.ids = [componentId];
            context.dbManager.addCommand(componentCmd);
            const issue = await base.getIssue(cmd, context, (perm, issueObj) => perm.componentAdmin || perm.moderate || (perm.editIssues && issueObj.createdByProperty.getId() === context.user.id));
            if (componentCmd.getResult().length !== 1) {
                throw new Error("The given id was no valid component id");
            }
            const component = componentCmd.getResult()[0];
            /*
            if (!context.user.permissions.getComponentPermissions(component.id).editIssueLocation && !context.user.permissions.globalPermissions.globalAdmin) {
                throw new Error("You are not permitted to add issues to the given component")
            }
            */
            const event = await issue.addToComponent(component, new Date(), context.user);
            return base.createResult(args, context, issue, event, { component });
        }
    }
}
export default addIssueToComponent;