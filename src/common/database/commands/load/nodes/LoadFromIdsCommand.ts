import { CCIMSNode } from "../../../../nodes/CCIMSNode";
import { NodeType } from "../../../../nodes/NodeType";
import { LoadNodeListCommand } from "./LoadNodeListCommand";

const commandFactories = new Map<string, () => LoadNodeListCommand<CCIMSNode>>();

export function getLoadCommand(table: string, ids: string[]): LoadNodeListCommand<CCIMSNode> {
    const commandFactory = commandFactories.get(table);
    if (!commandFactory) {
        throw new Error("no command factory registered for specified node type")
    }
    const command = commandFactory();
    command.ids = ids;
    return command;
}