import { CCIMSNode } from "../nodes/CCIMSNode";
import { IdGenerator } from "../util/IdGenerator";

export class DatabaseManager {
    nodes: Map<string, CCIMSNode> = new Map<string, CCIMSNode>();

    public readonly idGenerator: IdGenerator;

    public constructor (idGenerator: IdGenerator) {
        this.idGenerator = idGenerator;
    }

    /**
     * Adds the node to the internal node dictionary
     * This must be used to add new nodes, but also to register loaded nodes
     * Caution: if a node with the same id is already registered, it is overridden
     * @param node the node to register
     */
    public addNode(node: CCIMSNode): void {
        this.nodes.set(node.id, node);
    }

    /**
     * gets the node with the associated id or undefined if not found
     * @param id the id for the node to get
     */
    public getNode(id: string): CCIMSNode | undefined {
        return this.nodes.get(id);
    }
    
}