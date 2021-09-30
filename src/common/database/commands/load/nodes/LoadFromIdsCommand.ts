import { CCIMSNode } from "../../../../nodes/CCIMSNode";
import { LoadComponentInterfacesCommand } from "./LoadComponentInterfacesCommand";
import { LoadComponentsCommand } from "./LoadComponentsCommand";
import { LoadIMSSystemsCommand } from "./LoadIMSSystemsCommand";
import { LoadIssuesCommand } from "./LoadIssuesCommand";
import { LoadNodeListCommand } from "./LoadNodeListCommand";
import { LoadProjectsCommand } from "./LoadProjectsCommand";
import { LoadAddedToComponentEventsCommand } from "./timeline/LoadAddedToComponentEventsCommand";
import { LoadAssignedEventsCommand } from "./timeline/LoadAssignedEventsCommand";
import { LoadBodiesCommand } from "./timeline/LoadBodiesCommand";
import { LoadCategoryChangedEventsCommand } from "./timeline/LoadCategoryChangedEventsCommand";
import { LoadDeletedIssueCommentsCommand } from "./timeline/LoadDeletedIssueCommentsCommand";
import { LoadIssueCommentsCommand } from "./timeline/LoadIssueCommentsCommand";
import { LoadLinkEventsCommand } from "./timeline/LoadLinkEventsCommand";
import { LoadPinnedEventsCommand } from "./timeline/LoadPinnedEventsCommand";
import { LoadRemovedFromComponentEventsCommand } from "./timeline/LoadRemovedFromComponentEventsCommand";
import { LoadRenamedTitleEventsCommand } from "./timeline/LoadRenamedTitleEventsCommand";
import { LoadUnassignedEventsCommand } from "./timeline/LoadUnassignedEventsCommand";
import { LoadUnlinkEventsCommand } from "./timeline/LoadUnlinkEventsCommand";
import { LoadUnpinnedEventsCommand } from "./timeline/LoadUnpinnedEventsCommand";
import { LoadWasLinkedEventsCommand } from "./timeline/LoadWasLinkedEventsCommand";
import { LoadWasUnlinkedEventsCommand } from "./timeline/LoadWasUnlinkedEventsCommand";
import { LoadLabelsCommand } from "./LoadLabelsCommand";
import { LoadLabelledEventCommand } from "./timeline/LoadLabelledEventCommand";
import { LoadUnlabelledEventCommand } from "./timeline/LoadUnlabelledEventCommand";
import { LoadStartDateChangedEventsCommand } from "./timeline/LoadStartDateChangedEventsCommand";
import { LoadDueDateChangedEventsCommand } from "./timeline/LoadDueDateChangedEventsCommand";
import { LoadMarkedAsDuplicateEventsCommand } from "./timeline/LoadMarkedAsDuplicateEventsCommand";
import { LoadUnmarkedAsDuplicateEventsCommand } from "./timeline/LoadUnmarkedAsDuplicateEventsCommand";
import { LoadClosedEventsCommand } from "./timeline/LoadClosedEventsCommand";
import { LoadReopenedEventsCommand } from "./timeline/LoadReopenedEventsCommand";
import { LoadPriorityChangedEventsCommand } from "./timeline/LoadPriorityChangedEventsCommand";
import { LoadAddedToLocationEventsCommand } from "./timeline/LoadAddedToLocationEventsCommand";
import { LoadRemovedFromLocationEventsCommand } from "./timeline/LoadRemovedFromLocationEventsCommand";
import { LoadCCIMSUsersCommand } from "./LoadCCIMSUsersCommand";
import { LoadIMSUsersCommand } from "./LoadIMSUsersCommand";
import { LoadGlobalPermissionsCommand } from "./LoadGlobalPermissionsCommand";
import { LoadProjectPermissionsCommand } from "./LoadProjectPermissionsCommand";
import { LoadComponentPermissionsCommand } from "./LoadComponentPermissionsCommand";
import { LoadNonFunctionalConstraintsCommand } from "./LoadNonFunctionalConstraintsCommand";
import { LoadArtifactsCommand } from "./LoadArtifactsCommand";
import { LoadAddedNonFunctionalConstraintEventsCommand } from "./timeline/LoadAddedNonFunctionalConstraintEventsCommand";
import { LoadRemovedNonFunctionalConstraintEventsCommand } from "./timeline/LoadRemovedNonFunctionalConstraintEventsCommand";
import { LoadAddedArtifactEventsCommand } from "./timeline/LoadAddedArtifactEventsCommand";
import { LoadRemovedArtifactEventsCommand } from "./timeline/LoadRemovedArtifactEventsCommand";
import { LoadReactionGroupsCommand } from "./LoadReactionGroupsCommand";
import { LoadIMSComponentsCommand } from "./LoadIMSComponentsCommand";

/**
 * map with method to create command for each table name
 */
const commandFactories = new Map<string, (loadDeleted: boolean) => LoadNodeListCommand<CCIMSNode>>([
    ["component", (loadDeleted) => new LoadComponentsCommand(loadDeleted)],
    ["component_interface", (loadDeleted) => new LoadComponentInterfacesCommand(loadDeleted)],
    ["project", () => new LoadProjectsCommand()],
    ["ims_system", () => new LoadIMSSystemsCommand()],
    ["ccims_user", () => new LoadCCIMSUsersCommand()],
    ["ims_user", () => new LoadIMSUsersCommand()],
    ["global_permission", () => new LoadGlobalPermissionsCommand()],
    ["project_permission", () => new LoadProjectPermissionsCommand()],
    ["component_permission", () => new LoadComponentPermissionsCommand()],
    ["body", (loadDeleted) => new LoadBodiesCommand(loadDeleted)],
    ["issue", (loadDeleted) => new LoadIssuesCommand(loadDeleted)],
    ["label", (loadDeleted) => new LoadLabelsCommand(loadDeleted)],
    ["category_changed_event", (loadDeleted) => new LoadCategoryChangedEventsCommand(loadDeleted)],
    ["added_to_component_event", (loadDeleted) => new LoadAddedToComponentEventsCommand(loadDeleted)],
    ["removed_from_component_event", (loadDeleted) => new LoadRemovedFromComponentEventsCommand(loadDeleted)],
    ["comment", (loadDeleted) => new LoadIssueCommentsCommand(loadDeleted)],
    ["link_event", (loadDeleted) => new LoadLinkEventsCommand(loadDeleted)],
    ["unlink_event", (loadDeleted) => new LoadUnlinkEventsCommand(loadDeleted)],
    ["was_linked_event", (loadDeleted) => new LoadWasLinkedEventsCommand(loadDeleted)],
    ["was_unlinked_event", (loadDeleted) => new LoadWasUnlinkedEventsCommand(loadDeleted)],
    ["pinned_event", (loadDeleted) => new LoadPinnedEventsCommand(loadDeleted)],
    ["unpinned_event", (loadDeleted) => new LoadUnpinnedEventsCommand(loadDeleted)],
    ["renamed_title_event", (loadDeleted) => new LoadRenamedTitleEventsCommand(loadDeleted)],
    ["deleted_issue_comment", (loadDeleted) => new LoadDeletedIssueCommentsCommand(loadDeleted)],
    ["assigned_event", (loadDeleted) => new LoadAssignedEventsCommand(loadDeleted)],
    ["unassigned_event", (loadDeleted) => new LoadUnassignedEventsCommand(loadDeleted)],
    ["labelled_event", (loadDeleted) => new LoadLabelledEventCommand(loadDeleted)],
    ["unlabelled_event", (loadDeleted) => new LoadUnlabelledEventCommand(loadDeleted)],
    ["start_date_changed_event", (loadDeleted) => new LoadStartDateChangedEventsCommand(loadDeleted)],
    ["due_date_changed_event", (loadDeleted) => new LoadDueDateChangedEventsCommand(loadDeleted)],
    ["marked_as_duplicate_event", (loadDeleted) => new LoadMarkedAsDuplicateEventsCommand(loadDeleted)],
    ["unmarked_as_duplicate_event", (loadDeleted) => new LoadUnmarkedAsDuplicateEventsCommand(loadDeleted)],
    ["closed_event", (loadDeleted) => new LoadClosedEventsCommand(loadDeleted)],
    ["reopened_event", (loadDeleted) => new LoadReopenedEventsCommand(loadDeleted)],
    ["priority_changed_event", (loadDeleted) => new LoadPriorityChangedEventsCommand(loadDeleted)],
    ["added_to_location_event", (loadDeleted) => new LoadAddedToLocationEventsCommand(loadDeleted)],
    ["removed_from_location_event", (loadDeleted) => new LoadRemovedFromLocationEventsCommand(loadDeleted)],
    ["non_functional_constraint", (loadDeleted) => new LoadNonFunctionalConstraintsCommand(loadDeleted)],
    ["artifact", (loadDeleted) => new LoadArtifactsCommand(loadDeleted)],
    ["added_non_functional_constraint_event", (loadDeleted) => new LoadAddedNonFunctionalConstraintEventsCommand(loadDeleted)],
    ["removed_non_functional_constraint_event", (loadDeleted) => new LoadRemovedNonFunctionalConstraintEventsCommand(loadDeleted)],
    ["added_artifact_event", (loadDeleted) => new LoadAddedArtifactEventsCommand(loadDeleted)],
    ["removed_artifact_event", (loadDeleted) => new LoadRemovedArtifactEventsCommand(loadDeleted)],
    ["reaction_group", () => new LoadReactionGroupsCommand()],
    ["ims_component", () => new LoadIMSComponentsCommand()]
]);

/**
 * creates a command which loads all the nodes with ids from table
 * @param table the table where to load the nodes
 * @param ids the ids of the nodes to load
 */
export function getLoadCommand(table: string, ids?: string[], loadDeleted: boolean = false): LoadNodeListCommand<CCIMSNode> {
    const commandFactory = commandFactories.get(table);
    if (!commandFactory) {
        throw new Error(`no command factory registered for specified node type: ${table}`)
    }
    const command = commandFactory(loadDeleted);
    command.ids = ids;
    return command;
}