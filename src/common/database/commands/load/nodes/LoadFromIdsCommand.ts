import { CCIMSNode } from "../../../../nodes/CCIMSNode";
import { LoadComponentInterfacesCommand } from "./LoadComponentInterfacesCommand";
import { LoadComponentsCommand } from "./LoadComponentsCommand";
import { LoadImsSystemsCommand } from "./LoadImsSystemsCommand";
import { LoadIssuesCommand } from "./LoadIssuesCommand";
import { LoadNodeListCommand } from "./LoadNodeListCommand";
import { LoadProjectsCommand } from "./LoadProjectsCommand";
import { LoadUsersCommand } from "./LoadUsersCommand";
import { LoadAddedToComponentEventsCommand } from "./timeline/LoadAddedToComponentEventsCommand";
import { LoadBodiesCommand } from "./timeline/LoadBodiesCommand";
import { LoadCategoryChangedEventsCommand } from "./timeline/LoadCategoryChangedEvents";
import { LoadRemovedFromComponentEventsCommand } from "./timeline/LoadRemovedFromComponentEventsCommand";

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
    ["issue_timeline_categoryChangedEvent", () => new LoadCategoryChangedEventsCommand()],
    ["issue_timeline_addedToComponentEvent", () => new LoadAddedToComponentEventsCommand()],
    ["issue_timeline_removedFromComponentEvent", () => new LoadRemovedFromComponentEventsCommand()]
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