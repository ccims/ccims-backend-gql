import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import baseMutation from "../baseMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import GraphQLDeleteComponentInterfacePayload from "../../types/mutations/payloads/componentInterface/GraphQLDeleteComponentInterfacePayload";
import GraphQLDeleteComponentInterfaceInput from "../../types/mutations/inputs/componentInterface/GraphQLDeleteComponentInterfaceInput";
import { ComponentInterface } from "../../../../common/nodes/ComponentInterface";

function deleteComponentInterface(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLDeleteComponentInterfacePayload, GraphQLDeleteComponentInterfaceInput, "Delets the specified componentInterface");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.initMutation(args, context, perm => true);
            const componentInterfaceId = PreconditionCheck.checkString(input, "componentInterfaceId", 32);

            const componentInterface = await context.dbManager.getNode(componentInterfaceId);
            if (componentInterface === undefined || !(componentInterface instanceof ComponentInterface)) {
                throw new Error("The specified componentInterface id is not the id of a valid componentInterface");
            }

            base.userAllowed(context, permissions => permissions.getComponentPermissions(componentInterface.componentProperty.getId()).componentAdmin);

            await componentInterface.markDeleted();
            return base.createResult(args, {  });
        }
    };
}
export default deleteComponentInterface;