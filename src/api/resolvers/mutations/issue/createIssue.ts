import { GraphQLFieldConfig } from "graphql";
import { ResolverContext } from "../../../ResolverContext";
import GraphQLCreateIssuePayload from "../../types/mutations/payloads/issue/GraphQLCreateIssuePayload";
import GraphQLCreateIssueInput from "../../types/mutations/inputs/issue/GraphQLCreateIssueInput";
import baseMutation from "../baseMutation";
import { Issue } from "../../../../common/nodes/Issue";
import PreconditionCheck from "../../utils/PreconditionCheck";
import { LoadComponentsCommand } from "../../../../common/database/commands/load/nodes/LoadComponentsCommand";
import { LoadLabelsCommand } from "../../../../common/database/commands/load/nodes/LoadLabelsCommand";
import { LoadIssueLocationsCommand } from "../../../../common/database/commands/load/nodes/LoadIssueLocationsCommand";
import { LoadUsersCommand } from "../../../../common/database/commands/load/nodes/LoadUsersCommand";
import { IssueCategory } from "../../../../common/nodes/enums/IssueCategory";
import { LoadArtifactsCommand } from "../../../../common/database/commands/load/nodes/LoadArtifactsCommand";

function createIssue(): GraphQLFieldConfig<any, ResolverContext> {
    const base = baseMutation(GraphQLCreateIssuePayload, GraphQLCreateIssueInput, "Creates a new issue");
    return {
        ...base,
        resolve: async (src, args, context, info) => {
            const input = base.argsCheck(args);
            const title = PreconditionCheck.checkString(input, "title", 256);
            const body = PreconditionCheck.checkNullableString(input, "body", 65536) ?? "";
            const componentIDs = new Set(PreconditionCheck.checkStringList(input, "components", 32));
            const category = PreconditionCheck.checkNullableEnum<IssueCategory>(input, "category", IssueCategory) ?? IssueCategory.UNCLASSIFIED;
            const labelIds = new Set(PreconditionCheck.checkNullableStringList(input, "labels", 32));
            const assigneeIds = new Set(PreconditionCheck.checkNullableStringList(input, "assignees", 32));
            const locationIds = new Set(PreconditionCheck.checkNullableStringList(input, "locations", 32));
            const artifactIds = new Set(PreconditionCheck.checkNullableStringList(input, "artifacts", 32));
            const startDate = PreconditionCheck.checkNullableDate(input, "startDate");
            const dueDate = PreconditionCheck.checkNullableDate(input, "dueDate");
            const estimatedTime = PreconditionCheck.checkNullableTimespan(input, "estimatedTime");

            /*
            if (!context.user.permissions.globalPermissions.globalAdmin &&
                !Array.from(componentIDs).some(id => {
                    const compPerm = context.user.permissions.getComponentPermissions(id)
                    return compPerm.editIssues || compPerm.moderate || compPerm.componentAdmin || (locationIds.size <= 0 || compPerm.editIssueLocation)
                })) {
                throw new Error(`You are not permitted to create an issue on at least one of the components you selected or add it to the locations`);
            }
            */

            const componentCmd = new LoadComponentsCommand();
            componentCmd.ids = Array.from(componentIDs);
            context.dbManager.addCommand(componentCmd);

            let labelsCmd: LoadLabelsCommand | undefined;
            if (labelIds.size > 0) {
                labelsCmd = new LoadLabelsCommand();
                labelsCmd.ids = Array.from(labelIds);
                context.dbManager.addCommand(labelsCmd);
            }

            let assigneesCmd: LoadUsersCommand | undefined;
            if (assigneeIds.size > 0) {
                assigneesCmd = new LoadUsersCommand();
                assigneesCmd.ids = Array.from(assigneeIds);
                context.dbManager.addCommand(assigneesCmd);
            }

            let locationsCmd: LoadIssueLocationsCommand | undefined;
            if (locationIds.size > 0) {
                locationsCmd = new LoadIssueLocationsCommand();
                locationsCmd.ids = Array.from(locationIds);
                context.dbManager.addCommand(locationsCmd);
            }

            let artifactsCmd: LoadArtifactsCommand | undefined;
            if (artifactIds.size > 0) {
                artifactsCmd = new LoadArtifactsCommand();
                artifactsCmd.ids = Array.from(artifactIds);
                context.dbManager.addCommand(artifactsCmd);
            }

            await context.dbManager.executePendingCommands();

            const components = componentCmd.getResult();
            if (components.length !== componentIDs.size) {
                throw new Error("Not all the component ids given were valid component ids");
            }

            const labels = labelsCmd?.getResult();
            if (labelsCmd && labelsCmd.getResult().length !== labelIds.size) {
                throw new Error("Not all the label ids given were valid label ids");
            }

            const assignees = assigneesCmd?.getResult();
            if (assigneesCmd && assigneesCmd.getResult().length !== assigneeIds.size) {
                throw new Error("Not all the asignee ids given were valid user ids");
            }

            const locations = locationsCmd?.getResult();
            if (locationsCmd && locationsCmd.getResult().length !== locationIds.size) {
                throw new Error("Not all the location ids given were valid issue location ids");
            }

            const artifacts = artifactsCmd?.getResult();
            if (artifactsCmd && artifactsCmd.getResult().length !== artifactIds.size) {
                throw new Error("Not all the Artifact ids given were valid Artifact ids");
            }

            const now = new Date();
            const me = context.user;
            const issue = await Issue.create(context.dbManager, me, now, title, body);
            await Promise.all(components.map(component => issue.addToComponent(component, now, me)));
            await issue.changeCategory(category, now, me);
            if (labels && labels.length > 0) {
                await Promise.all(labels.map(label => issue.addLabel(label, now, me)));
            }
            if (assignees && assignees.length > 0) {
                await Promise.all(assignees.map(assignee => issue.assignUser(assignee, now, me)));
            }
            if (locations && locations.length > 0) {
                await Promise.all(locations.map(location => issue.addToLocation(location, now, me)));
            }
            if (artifacts && artifacts.length > 0) {
                await Promise.all(artifacts.map(artifact => issue.addArtifact(artifact, now, me)));
            }

            await issue.changeStartDate(startDate, now, me);
            await issue.changeDueDate(dueDate, now, me);
            //await issue.changeEstimatedTime(estimatedTime, now, me); TODO when implemented
            return base.createResult(args, context, { issue });
        }
    };
}
export default createIssue;