import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../ResolverContext";
import baseMutation from "./baseMutation";
import GraphQLCreateLabelPayload from "../types/mutations/payloads/label/GraphQLCreateLabelPayload";
import GraphQLCreateLabelInput from "../types/mutations/inputs/label/GraphQLCreateLabelInput";
import PreconditionCheck from "../utils/PreconditionCheck";
import { Color } from "../../../common/Color";
import { Label } from "../../../common/nodes/Label";
import { LoadComponentsCommand } from "../../../common/database/commands/load/nodes/LoadComponentsCommand";

function createLabel(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLCreateLabelPayload, GraphQLCreateLabelInput, "Create a new label in the system");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.argsCheck(args);
            const name = PreconditionCheck.checkString(input, "name", 256);
            const description = PreconditionCheck.checkNullableString(input, "description", 65536) ?? "";
            let color: Color | undefined = input.color;
            if (!color || !(color instanceof Color)) {
                color = new Color("#ffffff");
            }
            const componentIDs = new Set(PreconditionCheck.checkStringList(input, "components", 32));

            /*
            if (!context.user.permissions.globalPermissions.globalAdmin &&
                !Array.from(componentIDs).some(id => {
                    const compPerm = context.user.permissions.getComponentPermissions(id)
                    return compPerm.editIssues || !compPerm.moderate || compPerm.componentAdmin
                })) {
                throw new Error(`You are not permitted to create a label on at least one of the components you selected`);
            }
            */

            const componentCmd = new LoadComponentsCommand();
            componentCmd.ids = Array.from(componentIDs);
            context.dbManager.addCommand(componentCmd);
            await context.dbManager.executePendingCommands();

            if (componentCmd.getResult().length !== componentIDs.size) {
                throw new Error(`Not all given component ids were valid component ids`);
            }

            const label = await Label.create(context.dbManager, name, color, context.user, new Date(), description, componentCmd.getResult());
            return base.createResult(args, { label });
        }
    }
}
export default createLabel;