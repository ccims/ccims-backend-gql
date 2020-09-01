import { CCIMSNode } from "../nodes/CCIMSNode";

export interface NodeCache {
    /**
     * Adds the node to the internal node dictionary
     * This must be used to add new nodes, but also to register loaded nodes
     * Caution: if a node with the same id is already registered, it is overridden
     * @param node the node to register
     */
    addNode(node: CCIMSNode): void

    /**
     * gets the node with the associated id or undefined if not found
     * @param id the id for the node to get
     */
    getNode(id: string): CCIMSNode | undefined
}