import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLCreateComponentPayload from "../../types/mutations/payloads/component/GraphQLCreateComponentPayload";
import GraphQLCreateComponentInput from "../../types/mutations/inputs/component/GraphQLCreateComponentInput";
import { Component } from "../../../../common/nodes/Component";
import baseMutation from "../baseMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import { LoadProjectsCommand } from "../../../../common/database/commands/load/nodes/LoadProjectsCommand";
import { LoadComponentInterfacesCommand } from "../../../../common/database/commands/load/nodes/LoadComponentInterfacesCommand";

function createComponent(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLCreateComponentPayload, GraphQLCreateComponentInput, "Creates a new component in the ccims and adds it to the given users");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, perm => perm.globalPermissions.addRemoveComponents);

            const name = PreconditionCheck.checkString(input, "name", 256);
            const description = PreconditionCheck.checkNullableString(input, "description", 65536) ?? "";
            const repositoryURL = PreconditionCheck.checkNullableString(input, "repositoryURL", 65536) ?? "";
            const projectIds = new Set(PreconditionCheck.checkNullableStringList(input, "projects", 32));
            const consumedInterfacesIds = new Set(PreconditionCheck.checkNullableStringList(input, "consumedInterfaces", 32));

            /*
            if (Array.from(projectIds).some(id => !context.user.permissions.getProjectPermissions(id).addRemoveComponents) && !context.user.permissions.globalPermissions.globalAdmin) {
                throw new Error("You are not permitted to add the component to at least one of the specified pojects");
            }

            if (consumedInterfacesIds.size > 0 && (ownerId !== context.user.id || context.user.permissions.globalPermissions.globalAdmin)) {
                throw new Error("You are not permitted to set consumed interfaces for the component as you arne't the owner");
            }
            */

            let projectCmd: LoadProjectsCommand | undefined;
            if (projectIds.size > 0) {
                projectCmd = new LoadProjectsCommand();
                projectCmd.ids = Array.from(projectIds);
                context.dbManager.addCommand(projectCmd);
            }

            let interfacesCmd: LoadComponentInterfacesCommand | undefined;
            if (consumedInterfacesIds.size > 0) {
                interfacesCmd = new LoadComponentInterfacesCommand();
                interfacesCmd.ids = Array.from(projectIds);
                context.dbManager.addCommand(interfacesCmd);
            }

            await context.dbManager.executePendingCommands();

            if (projectCmd && projectCmd.getResult().length !== projectIds.size) {
                throw new Error("All project ids given must must be valid ids of existing projects");
            }

            if (interfacesCmd && interfacesCmd.getResult().length !== consumedInterfacesIds.size) {
                throw new Error("All ids given for the consumedInterfaces must must be valid ids of existing component interfaces");
            }

            const component = await Component.create(context.dbManager, name, description, repositoryURL, context.user, new Date());
            
            if (projectCmd) {
                await component.projectsProperty.addAll(projectCmd.getResult());
            }
            if (interfacesCmd) {
                await component.consumedInterfacesProperty.addAll(interfacesCmd?.getResult());
            }
            // owner.permissions.setComponentPermissions(component.id, new ComponentPermission(true, true, true, true, true));
            await context.dbManager.save();
            return base.createResult(args, { component });
        }
    };
}
export default createComponent;