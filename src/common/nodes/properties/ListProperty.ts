import { LoadNodeListCommand } from "../../database/commands/load/nodes/LoadNodeListCommand";
import { CCIMSNode } from "../CCIMSNode";

export interface ListProperty<T extends CCIMSNode> {
    /**
     * gets all elements which are in this relation and returned from filter
     * @param filter the filter to filter other nodes
     * @returns the array of filtered elements
     */
    getFilteredElements<S extends T>(filter: LoadNodeListCommand<S>): Promise<S[]>;
}