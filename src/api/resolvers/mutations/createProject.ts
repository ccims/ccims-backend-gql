import { GraphQLFieldConfig, GraphQLNonNull } from "graphql";
import { ResolverContext } from "../../ResolverContext";
import GraphQLCreateProjectPayload from "../types/mutations/payloads/GraphQLCreateProjectPayload";
import GraphQLCreateProjectInput from "../types/mutations/inputs/GraphQLCreateProjectInput";
import { Project } from "../../../common/nodes/Project";
import baseMutation from "./baseMutation";
import PreconditionCheck from "../utils/PreconditionCheck";
import { LoadUsersCommand } from "../../../common/database/commands/load/nodes/LoadUsersCommand";
import { LoadComponentsCommand } from "../../../common/database/commands/load/nodes/LoadComponentsCommand";
import { Component } from "../../../common/nodes/Component";
import { User } from "../../../common/nodes/User";

function createProject(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLCreateProjectPayload, GraphQLCreateProjectInput, "Creates a new project");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.argsCheck(args);
            const name = PreconditionCheck.checkString(input, "name", 256);
            const description = PreconditionCheck.checkString(input, "description", 65536);
            const ownerUserId = PreconditionCheck.checkString(input, "owner", 32);
            const componentIds = new Set(PreconditionCheck.checkNullableStringList(input, "components", 32));
            const userIds = new Set(PreconditionCheck.checkNullableStringList(input, "users", 32));
            userIds.add(ownerUserId)
            const userCmd = new LoadUsersCommand();
            userCmd.ids = Array.from(userIds);
            context.dbManager.addCommand(userCmd);
            let componentCmd: LoadComponentsCommand | undefined;
            if (componentIds.size > 0) {
                componentCmd = new LoadComponentsCommand();
                componentCmd.ids = Array.from(componentIds);
                context.dbManager.addCommand(componentCmd);
            }
            await context.dbManager.executePendingCommands();
            const users = userCmd.getResult();
            if (users.length !== userIds.size) {
                throw new Error("All ids given for the users and owner inputs must be valid user ids");
            }
            let components: Component[] | undefined;
            if (componentCmd) {
                components = componentCmd.getResult();
                if (components.length !== componentIds.size) {
                    throw new Error(`All ids given for the component input must be valid component ids`);
                }
            }
            const owner = await context.dbManager.getNode(ownerUserId);
            if (!owner || !(owner instanceof User)) {
                throw new Error("The owner id must be a valid user id");
            }
            const project = await Project.create(context.dbManager, name, description, owner);
            if (users.length > 1) {
                await project.usersProperty.addAll(users);
            }
            if (components && components.length > 1) {
                await project.componentsProperty.addAll(components);
            }
            await context.dbManager.save();
            return base.createResult(args, { project })
        }
    }
}
export default createProject;