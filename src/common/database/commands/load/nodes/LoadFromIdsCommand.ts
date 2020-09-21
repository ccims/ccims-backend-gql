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
import { LoadSyncNodeListCommand } from "./LoadSyncNodeListCommand";
import { LoadLabelsCommand } from "./LoadLabelsCommand";
import { LoadLabelledEventCommand } from "./timeline/LoadLabelledEventCommand";
import { LoadUnlabelledEventCommand } from "./timeline/LoadUnlabelledEventCommand";
import { LoadStartDateChangedEventsCommand } from "./timeline/LoadStartDateChangedEventsCommand";
import { LoadDueDateChangedEventsCommand } from "./timeline/LoadDueDateChangedEventsCommand";

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
    ["issue_timeline_categoryChangedEvent", () => new LoadCategoryChangedEventsCommand()],
    ["issue_timeline_addedToComponentEvent", () => new LoadAddedToComponentEventsCommand()],
    ["issue_timeline_removedFromComponentEvent", () => new LoadRemovedFromComponentEventsCommand()],
    ["issue_timeline_issueComment", () => new LoadIssueCommentsCommand()],
    ["issue_timeline_linkEvent", () => new LoadLinkEventsCommand()],
    ["issue_timeline_unlinkEvent", () => new LoadUnlinkEventsCommand()],
    ["issue_timeline_wasLinkedEvent", () => new LoadWasLinkedEventsCommand()],
    ["issue_timeline_wasUnlinkedEvent", () => new LoadWasUnlinkedEventsCommand()],
    ["issue_timeline_pinnedEvent", () => new LoadPinnedEventsCommand()],
    ["issue_timeline_unpinnedEvent", () => new LoadUnpinnedEventsCommand()],
    ["issue_timeline_renamedTitleEvent", () => new LoadRenamedTitleEventsCommand()],
    ["issue_timeline_deletedIssueComment", () => new LoadDeletedIssueCommentsCommand()],
    ["issue_timeline_assignedEvent", () => new LoadAssignedEventsCommand()],
    ["issue_timeline_unassignedEvent", () => new LoadUnassignedEventsCommand()],
    ["issue_timeline_labelledEvent", () => new LoadLabelledEventCommand()],
    ["issue_timeline_unlabelledEvent", () => new LoadUnlabelledEventCommand()],
    ["issue_timeline_startDateChangedEvent", () => new LoadStartDateChangedEventsCommand()],
    ["issue_timneline_dueDateChangedEvent", () => new LoadDueDateChangedEventsCommand()]
]);

/**
 * creates a command which loads all the nodes with ids from table
 * @param table the table where to load the nodes
 * @param ids the ids of the nodes to load
 */
export function getLoadCommand(table: string, ids?: string[]): LoadNodeListCommand<CCIMSNode> {
    const commandFactory = commandFactories.get(table);
    if (!commandFactory) {
        throw new Error("no command factory registered for specified node type")
    }
    const command = commandFactory();
    command.ids = ids;
    return command;
}