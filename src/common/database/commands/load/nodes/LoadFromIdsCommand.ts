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
    ["issue_timeline_categorychangedevent", () => new LoadCategoryChangedEventsCommand()],
    ["issue_timeline_addedtocomponentevent", () => new LoadAddedToComponentEventsCommand()],
    ["issue_timeline_removedfromcomponentevent", () => new LoadRemovedFromComponentEventsCommand()],
    ["issue_timeline_comment", () => new LoadIssueCommentsCommand()],
    ["issue_timeline_linkevent", () => new LoadLinkEventsCommand()],
    ["issue_timeline_unlinkevent", () => new LoadUnlinkEventsCommand()],
    ["issue_timeline_waslinkedevent", () => new LoadWasLinkedEventsCommand()],
    ["issue_timeline_wasunlinkedevent", () => new LoadWasUnlinkedEventsCommand()],
    ["issue_timeline_pinnedevent", () => new LoadPinnedEventsCommand()],
    ["issue_timeline_unpinnedevent", () => new LoadUnpinnedEventsCommand()],
    ["issue_timeline_renamedtitleevent", () => new LoadRenamedTitleEventsCommand()],
    ["issue_timeline_deletedissuecomment", () => new LoadDeletedIssueCommentsCommand()],
    ["issue_timeline_assignedevent", () => new LoadAssignedEventsCommand()],
    ["issue_timeline_unassignedevent", () => new LoadUnassignedEventsCommand()],
    ["issue_timeline_labelledevent", () => new LoadLabelledEventCommand()],
    ["issue_timeline_unlabelledevent", () => new LoadUnlabelledEventCommand()],
    ["issue_timeline_startdatechangedevent", () => new LoadStartDateChangedEventsCommand()],
    ["issue_timneline_duedatechangedevent", () => new LoadDueDateChangedEventsCommand()],
    ["issue_timeline_markedasduplicateevent", () => new LoadMarkedAsDuplicateEventsCommand()],
    ["issue_timeline_unmarkedasduplicateevent", () => new LoadUnmarkedAsDuplicateEventsCommand()],
    ["issue_timeline_closedevent", () => new LoadClosedEventsCommand()],
    ["issue_timeline_reopenedevent", () => new LoadReopenedEventsCommand()],
    ["issue_timeline_prioritychangedevent", () => new LoadPriorityChangedEventsCommand()],
    ["issue_timeline_addedtolocationevent", () => new LoadAddedToLocationEventsCommand()],
    ["issue_timeline_removedfromlocationevent", () => new LoadRemovedFromLocationEventsCommand()]
]);

/**
 * creates a command which loads all the nodes with ids from table
 * @param table the table where to load the nodes
 * @param ids the ids of the nodes to load
 */
export function getLoadCommand(table: string, ids?: string[]): LoadNodeListCommand<CCIMSNode> {
    const commandFactory = commandFactories.get(table.toLowerCase());
    if (!commandFactory) {
        throw new Error(`no command factory registered for specified node type: ${table}`)
    }
    const command = commandFactory();
    command.ids = ids;
    return command;
}