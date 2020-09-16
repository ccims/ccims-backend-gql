import { CCIMSNode } from "../../../../nodes/CCIMSNode";
import { LoadComponentsCommand } from "./LoadComponentsCommand";
import { LoadImsSystemsCommand } from "./LoadImsSystemsCommand";
import { LoadNodeListCommand } from "./LoadNodeListCommand";
import { LoadProjectsCommand } from "./LoadProjectsCommand";

/**
 * map with method to create command for each table name
 */
const commandFactories = new Map<string, () => LoadNodeListCommand<CCIMSNode>>([
    ["component", () => new LoadComponentsCommand()],
    ["project", () => new LoadProjectsCommand()],
    ["ims_system", () => new LoadImsSystemsCommand()]
]);

/**
 * creates a command which loads all the nodes with ids from table
 * @param table the table where to load the nodes
 * @param ids the ids of the nodes to load
 */
export function getLoadCommand(table: string, ids: string[]): LoadNodeListCommand<CCIMSNode> {
    const commandFactory = commandFactories.get(table);
    if (!commandFactory) {
        throw new Error("no command factory registered for specified node type")
    }
    const command = commandFactory();
    command.ids = ids;
    return command;
}