import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import baseMutation from "../baseMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import { LoadProjectsCommand } from "../../../../common/database/commands/load/nodes/LoadProjectsCommand";
import { LoadComponentsCommand } from "../../../../common/database/commands/load/nodes/LoadComponentsCommand";
import GraphQLAddComponentToProjectPayload from "../../types/mutations/payloads/project/GraphQLAddComponentToProjectInput";
import GraphQLAddComponentToProjectInput from "../../types/mutations/inputs/project/GraphQLAddComponentToProjectInput";
import { log } from "../../../../log";

function addComponentToProject(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLAddComponentToProjectPayload, GraphQLAddComponentToProjectInput, "Adds the specified component to the project if it is not already on the project");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, perm => true);
            const projectId = PreconditionCheck.checkString(input, "projectId", 32);
            const componentId = PreconditionCheck.checkString(input, "componentId", 32);

            base.userAllowed(context, permissions => permissions.getProjectPermissions(projectId).addRemoveComponents);

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
            
            if (!(await project.componentsProperty.hasId(componentId))) {
                await project.componentsProperty.add(component);
                await context.dbManager.save();
                return base.createResult(args, { project, component, componentId });
            } else {
                log(5, `tried to add component ${componentId} which was already on project ${projectId}`);
                return base.createResult(args, { });
            }
            
        }
    };
}
export default addComponentToProject;