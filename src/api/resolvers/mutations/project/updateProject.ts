import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLUpdateProjectPayload from "../../types/mutations/payloads/project/GraphQLUpdateProjectPayload";
import GraphQLUpdateProjectInput from "../../types/mutations/inputs/project/GraphQLUpdateProjectInput";
import baseMutation from "../baseMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import { LoadProjectsCommand } from "../../../../common/database/commands/load/nodes/LoadProjectsCommand";

function updateProject(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLUpdateProjectPayload, GraphQLUpdateProjectInput, "Updates the specified project");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, perm => perm.globalPermissions.addRemoveProjects);
            const name = PreconditionCheck.checkNullableString(input, "name", 256);
            const description = PreconditionCheck.checkNullableString(input, "description", 65536);
            const projectId = PreconditionCheck.checkString(input, "projectId", 32);

            base.userAllowed(context, permissions => permissions.getProjectPermissions(projectId).projectAdmin);

            const projectCommand = new LoadProjectsCommand();
            projectCommand.ids = [projectId];
            context.dbManager.addCommand(projectCommand);
            await context.dbManager.executePendingCommands();
            if (projectCommand.getResult().length !== 1) {
                throw new Error("The given id was no valid project id");
            }
            const project = projectCommand.getResult()[0];
            
            if (name !== undefined) {
                project.name = name;
            }
            if (description !== undefined) {
                project.description = description;
            }
            
            await context.dbManager.save();
            return base.createResult(args, { project })
        }
    }
}
export default updateProject;