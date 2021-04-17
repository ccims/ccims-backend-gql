import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import baseMutation from "../baseMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import GraphQLRemoveComponentFromProjectPayload from "../../types/mutations/payloads/project/GraphQLRemoveComponentFromProjectPayload";
import GraphQLRemoveComponentFromProjectInput from "../../types/mutations/inputs/project/GraphQLRemoveComponentFromProjectInput";
import { Project } from "../../../../common/nodes/Project";
import { Component } from "../../../../common/nodes/Component";

function removeComponentFromProject(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLRemoveComponentFromProjectPayload, GraphQLRemoveComponentFromProjectInput, "Removes the specified component from the project if it is on the project");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, perm => true);
            const projectId = PreconditionCheck.checkString(input, "project", 32);
            const componentId = PreconditionCheck.checkString(input, "component", 32);

            base.userAllowed(context, permissions => permissions.getProjectPermissions(projectId).addRemoveComponents);


            const project = await context.dbManager.getNode(projectId);
            if (project === undefined || !(project instanceof Project)) {
                throw new Error("The given project id is not a valid project id");
            }

            const component = await context.dbManager.getNode(componentId);
            if (component === undefined || !(component instanceof Component)) {
                throw new Error("The given component id is not a valid component id");
            }

            if (await project.componentsProperty.hasId(componentId)) {
                await project.componentsProperty.remove(component);
                return base.createResult(args, context, { project, component });
            } else {
                throw new Error("The specified component is not on the specified project");
            }

        }
    };
}
export default removeComponentFromProject;