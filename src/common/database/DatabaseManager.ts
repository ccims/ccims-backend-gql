import { CCIMSNode } from "../nodes/CCIMSNode";
import { IdGenerator } from "../util/IdGenerator";
import { NodeCache } from "./NodeCache";
import { DatabaseCommand } from "./DatabaseCommand";

/**
 * Adds database support, also has an IdGenerator
 * All nodes must be registered on this object
 */
export class DatabaseManager implements NodeCache {
    nodes: Map<string, CCIMSNode> = new Map<string, CCIMSNode>();

    public readonly idGenerator: IdGenerator;

    private pendingCommands: DatabaseCommand<any>[] = [];

    /**
     * creates a new DatabaseManager with the specified id generator
     * normally, there should only be one DatabaseManager
     * @param idGenerator the idGenerator to generate new ids
     */
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

    /**
     * add a DatabaseCommand to the pending command collection
     * this does not execute command, to do this @see executePendingCommands
     * @param command the command to add
     */
    public addCommand(command: DatabaseCommand<any>): void {
        this.pendingCommands.push(command);
    }

    /**
     * executes all pending commands in a transaction
     * after this, it is possible to get the result of each command
     */
    public async executePendingCommands(): Promise<void> {
        //TODO add transaction
        Promise.all(this.pendingCommands.map(async (command): Promise<void> => {
            //TODO implementation
        }));
        this.pendingCommands = [];
    }
    
}