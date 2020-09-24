import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import baseMutation from "../baseMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import { LoadProjectsCommand } from "../../../../common/database/commands/load/nodes/LoadProjectsCommand";
import { LoadComponentsCommand } from "../../../../common/database/commands/load/nodes/LoadComponentsCommand";
import GraphQLRemoveComponentFromProjectPayload from "../../types/mutations/payloads/project/GraphQLRemoveComponentFromProjectInput";
import GraphQLRemoveComponentFromProjectInput from "../../types/mutations/inputs/project/GraphQLRemoveComponentFromProjectInput";

function removeComponentFromProject(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLRemoveComponentFromProjectPayload, GraphQLRemoveComponentFromProjectInput, "Removes the specified component from the project if it is on the project");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, perm => true);
            const projectId = PreconditionCheck.checkString(input, "projectId", 32);
            const componentId = PreconditionCheck.checkString(input, "componentId", 32);

            const projectCommand = new LoadProjectsCommand();
            projectCommand.ids = [projectId];
            context.dbManager.addCommand(projectCommand);
            await context.dbManager.executePendingCommands();
            if (projectCommand.getResult().length !== 1) {
                throw new Error("The given id was no valid project id");
            }
            const project = projectCommand.getResult()[0];

            const componentCommand = new LoadComponentsCommand();
            componentCommand.ids = [componentId];
            context.dbManager.addCommand(componentCommand);
            await context.dbManager.executePendingCommands();
            if (componentCommand.getResult().length !== 1) {
                throw new Error ("The given id was no valid component id");
            }
            const component = componentCommand.getResult()[0];

            base.userAllowed(context, permissions => permissions.getProjectPermissions(projectId).addRemoveComponents);
            
            if (await project.componentsProperty.hasId(componentId)) {
                await project.componentsProperty.remove(component);
                await context.dbManager.save();
                return base.createResult(args, { project, component });
            } else {
                throw new Error("The specified component is not on the specified project");
            }
            
        }
    };
}
export default removeComponentFromProject;