import { GraphQLFieldConfig } from "graphql";
import { LoadComponentsCommand } from "../../../../common/database/commands/load/nodes/LoadComponentsCommand";
import { Component } from "../../../../common/nodes/Component";
import { Project } from "../../../../common/nodes/Project";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLCreateProjectInput from "../../types/mutations/inputs/project/GraphQLCreateProjectInput";
import GraphQLCreateProjectPayload from "../../types/mutations/payloads/project/GraphQLCreateProjectPayload";
import PreconditionCheck from "../../utils/PreconditionCheck";
import baseMutation from "../baseMutation";


function createProject(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLCreateProjectPayload, GraphQLCreateProjectInput, "Creates a new project");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, perm => perm.globalPermissions.addRemoveProjects);
            const name = PreconditionCheck.checkString(input, "name", 256);
            const description = PreconditionCheck.checkNullableString(input, "description", 65536) ?? "";
            const componentIds = new Set(PreconditionCheck.checkNullableStringList(input, "components", 32));
            /*
            if ((componentIds.size > 0) && !(ownerUserId === context.user.id || context.user.permissions.globalPermissions.globalAdmin)) {
                throw new Error("You are not the owner of the new project, you can't add users or components")
            }
            */
            let componentCmd: LoadComponentsCommand | undefined;
            if (componentIds.size > 0) {
                componentCmd = new LoadComponentsCommand();
                componentCmd.ids = Array.from(componentIds);
                context.dbManager.addCommand(componentCmd);
            }
            await context.dbManager.executePendingCommands();
            let components: Component[] | undefined;
            if (componentCmd) {
                components = componentCmd.getResult();
                if (components.length !== componentIds.size) {
                    throw new Error(`All ids given for the component input must be valid component ids`);
                }
            }
            
            const project = await Project.create(context.dbManager, name, description);
            if (components && components.length >= 1) {
                await project.componentsProperty.addAll(components);
            }
            // owner.permissions.setProjectPermissions(project.id, new ProjectPermission(true, true));
            await context.dbManager.save();
            return base.createResult(args, { project });
        }
    }
}
export default createProject;