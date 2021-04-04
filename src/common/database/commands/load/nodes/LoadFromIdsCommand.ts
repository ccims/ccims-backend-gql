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

/**
 * map with method to create command for each table name
 */
const commandFactories = new Map<string, (loadDeleted: boolean) => LoadNodeListCommand<CCIMSNode>>([
    ["component", (loadDeleted) => new LoadComponentsCommand(loadDeleted)],
    ["component_interface", (loadDeleted) => new LoadComponentInterfacesCommand(loadDeleted)],
    ["project", () => new LoadProjectsCommand()],
    ["ims_system", () => new LoadIMSSystemsCommand()],
    ["ccims_users", () => new LoadCCIMSUsersCommand()],
    ["ims_users", () => new LoadIMSUsersCommand()],
    ["issue_timeline_body", (loadDeleted) => new LoadBodiesCommand(loadDeleted)],
    ["issue_issue", (loadDeleted) => new LoadIssuesCommand(loadDeleted)],
    ["issue_label", (loadDeleted) => new LoadLabelsCommand(loadDeleted)],
    ["issue_timeline_category_changed_event", (loadDeleted) => new LoadCategoryChangedEventsCommand(loadDeleted)],
    ["issue_timeline_added_to_component_event", (loadDeleted) => new LoadAddedToComponentEventsCommand(loadDeleted)],
    ["issue_timeline_removed_from_component_event", (loadDeleted) => new LoadRemovedFromComponentEventsCommand(loadDeleted)],
    ["issue_timeline_comment", (loadDeleted) => new LoadIssueCommentsCommand(loadDeleted)],
    ["issue_timeline_link_event", (loadDeleted) => new LoadLinkEventsCommand(loadDeleted)],
    ["issue_timeline_unlink_event", (loadDeleted) => new LoadUnlinkEventsCommand(loadDeleted)],
    ["issue_timeline_was_linked_event", (loadDeleted) => new LoadWasLinkedEventsCommand(loadDeleted)],
    ["issue_timeline_was_unlinked_event", (loadDeleted) => new LoadWasUnlinkedEventsCommand(loadDeleted)],
    ["issue_timeline_pinned_event", (loadDeleted) => new LoadPinnedEventsCommand(loadDeleted)],
    ["issue_timeline_unpinned_event", (loadDeleted) => new LoadUnpinnedEventsCommand(loadDeleted)],
    ["issue_timeline_renamed_title_event", (loadDeleted) => new LoadRenamedTitleEventsCommand(loadDeleted)],
    ["issue_timeline_deleted_issue_comment", (loadDeleted) => new LoadDeletedIssueCommentsCommand(loadDeleted)],
    ["issue_timeline_assigned_event", (loadDeleted) => new LoadAssignedEventsCommand(loadDeleted)],
    ["issue_timeline_unassigned_event", (loadDeleted) => new LoadUnassignedEventsCommand(loadDeleted)],
    ["issue_timeline_labelled_event", (loadDeleted) => new LoadLabelledEventCommand(loadDeleted)],
    ["issue_timeline_unlabelled_event", (loadDeleted) => new LoadUnlabelledEventCommand(loadDeleted)],
    ["issue_timeline_start_date_changed_event", (loadDeleted) => new LoadStartDateChangedEventsCommand(loadDeleted)],
    ["issue_timneline_due_date_changed_event", (loadDeleted) => new LoadDueDateChangedEventsCommand(loadDeleted)],
    ["issue_timeline_marked_as_duplicate_event", (loadDeleted) => new LoadMarkedAsDuplicateEventsCommand(loadDeleted)],
    ["issue_timeline_unmarked_as_duplicate_event", (loadDeleted) => new LoadUnmarkedAsDuplicateEventsCommand(loadDeleted)],
    ["issue_timeline_closed_event", (loadDeleted) => new LoadClosedEventsCommand(loadDeleted)],
    ["issue_timeline_reopened_event", (loadDeleted) => new LoadReopenedEventsCommand(loadDeleted)],
    ["issue_timeline_priority_changed_event", (loadDeleted) => new LoadPriorityChangedEventsCommand(loadDeleted)],
    ["issue_timeline_added_to_location_event", (loadDeleted) => new LoadAddedToLocationEventsCommand(loadDeleted)],
    ["issue_timeline_removed_from_location_event", (loadDeleted) => new LoadRemovedFromLocationEventsCommand(loadDeleted)]
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