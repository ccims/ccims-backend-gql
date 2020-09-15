import { CCIMSNode } from "../../../../nodes/CCIMSNode";
import { NodeType } from "../../../../nodes/NodeType";
import { LoadComponentsCommand } from "./LoadComponentsCommand";
import { LoadImsSystemsCommand } from "./LoadImsSystemsCommand";
import { LoadNodeListCommand } from "./LoadNodeListCommand";
import { LoadProjectsCommand } from "./LoadProjectsCommand";

const commandFactories = new Map<string, () => LoadNodeListCommand<CCIMSNode>>([
    ["component", () => new LoadComponentsCommand()],
    ["project", () => new LoadProjectsCommand()],
    ["ims_system", () => new LoadImsSystemsCommand()]
]);

export function getLoadCommand(table: string, ids: string[]): LoadNodeListCommand<CCIMSNode> {
    const commandFactory = commandFactories.get(table);
    if (!commandFactory) {
        throw new Error("no command factory registered for specified node type")
    }
    const command = commandFactory();
    command.ids = ids;
    return command;
}