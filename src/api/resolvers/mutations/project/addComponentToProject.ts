import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import baseMutation from "../baseMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import GraphQLAddComponentToProjectPayload from "../../types/mutations/payloads/project/GraphQLAddComponentToProjectPayload";
import GraphQLAddComponentToProjectInput from "../../types/mutations/inputs/project/GraphQLAddComponentToProjectInput";
import { log } from "../../../../log";
import { Component } from "../../../../common/nodes/Component";
import { Project } from "../../../../common/nodes/Project";

function addComponentToProject(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLAddComponentToProjectPayload, GraphQLAddComponentToProjectInput, "Adds the specified component to the project if it is not already on the project");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, perm => true);
            const projectId = PreconditionCheck.checkString(input, "projectId", 32);
            const componentId = PreconditionCheck.checkString(input, "componentId", 32);

            base.userAllowed(context, permissions => permissions.getProjectPermissions(projectId).addRemoveComponents);

            const project = await context.dbManager.getNode(projectId);
            if (project === undefined || !(project instanceof Project)) {
                throw new Error("The given project id is not a valid project id");
            }

            const component = await context.dbManager.getNode(componentId);
            if (component === undefined || !(component instanceof Component)) {
                throw new Error("The given component id is not a valid component id");
            }

            if (!(await project.componentsProperty.hasId(componentId))) {
                await project.componentsProperty.add(component);
                return base.createResult(args, { project, component });
            } else {
                log(5, `tried to add component ${componentId} which was already on project ${projectId}`);
                return base.createResult(args, { });
            }

        }
    };
}
export default addComponentToProject;