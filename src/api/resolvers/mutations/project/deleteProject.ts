import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import baseMutation from "../baseMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import GraphQLDeleteProjectPayload from "../../types/mutations/payloads/project/GraphQLDeleteProjectPayload";
import GraphQLDeleteProjectInput from "../../types/mutations/inputs/project/GraphQLDeleteProjectInput";
import { LoadProjectsCommand } from "../../../../common/database/commands/load/nodes/LoadProjectsCommand";

function deleteProject(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLDeleteProjectPayload, GraphQLDeleteProjectInput, "Delets the specified project");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, perm => true);
            const projectId = PreconditionCheck.checkString(input, "projectId", 32);

            const projectCommand = new LoadProjectsCommand();
            projectCommand.ids = [projectId];
            context.dbManager.addCommand(projectCommand);
            await context.dbManager.executePendingCommands();
            if (projectCommand.getResult().length !== 1) {
                throw new Error("The given id was no valid project id");
            }
            const project = projectCommand.getResult()[0];
            base.userAllowed(context, permissions => permissions.globalPermissions.addRemoveProjects);

            await project.markDeleted();
            return base.createResult(args, {  });
        }
    };
}
export default deleteProject;