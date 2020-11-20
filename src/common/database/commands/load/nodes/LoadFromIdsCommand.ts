import { CCIMSNode } from "../../../../nodes/CCIMSNode";
import { LoadComponentInterfacesCommand } from "./LoadComponentInterfacesCommand";
import { LoadComponentsCommand } from "./LoadComponentsCommand";
import { LoadImsSystemsCommand } from "./LoadImsSystemsCommand";
import { LoadIssuesCommand } from "./LoadIssuesCommand";
import { LoadNodeListCommand } from "./LoadNodeListCommand";
import { LoadProjectsCommand } from "./LoadProjectsCommand";
import { LoadUsersCommand } from "./LoadUsersCommand";
import { LoadAddedToComponentEventsCommand } from "./timeline/LoadAddedToComponentEventsCommand";
import { LoadAssignedEventsCommand } from "./timeline/LoadAssignedEventsCommand";
import { LoadBodiesCommand } from "./timeline/LoadBodiesCommand";
import { LoadCategoryChangedEventsCommand } from "./timeline/LoadCategoryChangedEvents";
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

/**
 * map with method to create command for each table name
 */
const commandFactories = new Map<string, () => LoadNodeListCommand<CCIMSNode>>([
    ["component", () => new LoadComponentsCommand()],
    ["component_interface", () => new LoadComponentInterfacesCommand()],
    ["project", () => new LoadProjectsCommand()],
    ["ims_system", () => new LoadImsSystemsCommand()],
    ["users", () => new LoadUsersCommand()],
    ["issue_timeline_body", () => new LoadBodiesCommand()],
    ["issue_issue", () => new LoadIssuesCommand()],
    ["issue_label", () => new LoadLabelsCommand()],
    ["issue_timeline_category_changed_event", () => new LoadCategoryChangedEventsCommand()],
    ["issue_timeline_added_to_component_event", () => new LoadAddedToComponentEventsCommand()],
    ["issue_timeline_removed_from_component_event", () => new LoadRemovedFromComponentEventsCommand()],
    ["issue_timeline_comment", () => new LoadIssueCommentsCommand()],
    ["issue_timeline_link_event", () => new LoadLinkEventsCommand()],
    ["issue_timeline_unlink_event", () => new LoadUnlinkEventsCommand()],
    ["issue_timeline_was_linked_event", () => new LoadWasLinkedEventsCommand()],
    ["issue_timeline_was_unlinked_event", () => new LoadWasUnlinkedEventsCommand()],
    ["issue_timeline_pinned_event", () => new LoadPinnedEventsCommand()],
    ["issue_timeline_unpinned_event", () => new LoadUnpinnedEventsCommand()],
    ["issue_timeline_renamed_title_event", () => new LoadRenamedTitleEventsCommand()],
    ["issue_timeline_deleted_issue_comment", () => new LoadDeletedIssueCommentsCommand()],
    ["issue_timeline_assigned_event", () => new LoadAssignedEventsCommand()],
    ["issue_timeline_unassigned_event", () => new LoadUnassignedEventsCommand()],
    ["issue_timeline_labelled_event", () => new LoadLabelledEventCommand()],
    ["issue_timeline_unlabelled_event", () => new LoadUnlabelledEventCommand()],
    ["issue_timeline_start_date_changed_event", () => new LoadStartDateChangedEventsCommand()],
    ["issue_timneline_due_date_changed_event", () => new LoadDueDateChangedEventsCommand()],
    ["issue_timeline_marked_as_duplicate_event", () => new LoadMarkedAsDuplicateEventsCommand()],
    ["issue_timeline_unmarked_as_duplicate_event", () => new LoadUnmarkedAsDuplicateEventsCommand()],
    ["issue_timeline_closed_event", () => new LoadClosedEventsCommand()],
    ["issue_timeline_reopened_event", () => new LoadReopenedEventsCommand()],
    ["issue_timeline_priority_changed_event", () => new LoadPriorityChangedEventsCommand()],
    ["issue_timeline_added_to_location_event", () => new LoadAddedToLocationEventsCommand()],
    ["issue_timeline_removed_from_location_event", () => new LoadRemovedFromLocationEventsCommand()]
]);

/**
 * creates a command which loads all the nodes with ids from table
 * @param table the table where to load the nodes
 * @param ids the ids of the nodes to load
 */
export function getLoadCommand(table: string, ids?: string[]): LoadNodeListCommand<CCIMSNode> {
    const commandFactory = commandFactories.get(table);
    if (!commandFactory) {
        throw new Error(`no command factory registered for specified node type: ${table}`)
    }
    const command = commandFactory();
    command.ids = ids;
    return command;
}