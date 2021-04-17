import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLAddIssueToLocationPayload from "../../types/mutations/payloads/issue/GraphQLAddIssueToLocationPayload";
import GraphQLAddIssueToLocationInput from "../../types/mutations/inputs/issue/GraphQLAddIssueToLocationInput";
import timelineMutation from "./timelineMutation";
import PreconditionCheck from "../../utils/PreconditionCheck";
import { LoadIssueLocationsCommand } from "../../../../common/database/commands/load/nodes/LoadIssueLocationsCommand";
import { Component } from "../../../../common/nodes/Component";
import { ComponentInterface } from "../../../../common/nodes/ComponentInterface";
import { log } from "../../../../log";

function addIssueToLocation(): GraphQLFieldConfig<any, ResolverContext> {
    const base = timelineMutation(GraphQLAddIssueToLocationPayload, GraphQLAddIssueToLocationInput, "Adds an issue to a location (location or interface)");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const { cmd, input } = base.initTimelineMutation(args, context);
            const locationId = PreconditionCheck.checkString(input, "location", 32);
            const locationCmd = new LoadIssueLocationsCommand();
            locationCmd.ids = [locationId];
            context.dbManager.addCommand(locationCmd);
            const issue = await base.getIssue(cmd, context, (perm, issueObj) => true);
            if (locationCmd.getResult().length !== 1) {
                throw new Error("The given id was no valid issue location id");
            }
            const location = locationCmd.getResult()[0];
            let componentId: string;
            if (location instanceof Component) {
                componentId = (location as Component).id;
            } else if (location instanceof ComponentInterface) {
                componentId = (location as ComponentInterface).componentProperty.getId();
            } else {
                log(2, "A issue location was returned that is neiter a Component nor a ComponentInterface");
                throw new Error("An internal server error occured");
            }
            /*
            if (!context.user.permissions.getComponentPermissions(componentId).editIssueLocation && !context.user.permissions.globalPermissions.globalAdmin) {
                throw new Error("You are not permitted to add issues to new locations on the component the specified location belongs to")
            }
            */
            const event = await issue.addToLocation(location, new Date(), context.user);
            return base.createResult(args, issue, event, { location });
        }
    }
}
export default addIssueToLocation;