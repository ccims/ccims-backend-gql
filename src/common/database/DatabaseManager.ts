import { CCIMSNode } from "../nodes/CCIMSNode";
import { IdGenerator } from "../util/IdGenerator";
import { NodeCache } from "./NodeCache";
import { DatabaseCommand } from "./DatabaseCommand";
import { Client } from "pg";
import { config } from "../../config";
import { log } from "../../log";

/**
 * Adds database support, also has an IdGenerator
 * All nodes must be registered on this object
 */
export class DatabaseManager implements NodeCache {
    nodes: Map<string, CCIMSNode> = new Map<string, CCIMSNode>();

    public readonly idGenerator: IdGenerator;

    private pendingCommands: DatabaseCommand<any>[] = [];

    private readonly pgClient: Client;

    /**
     * creates a new DatabaseManager with the specified id generator
     * normally, there should only be one DatabaseManager
     * @param idGenerator the idGenerator to generate new ids
     */
    public constructor (idGenerator: IdGenerator, client: Client) {
        this.idGenerator = idGenerator;
        this.pgClient = client
        this.pgClient.connect();
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
        command.subCommands.forEach(this.addCommand);
    }

    /**
     * executes all pending commands in a transaction
     * after this, it is possible to get the result of each command
     */
    public async executePendingCommands(): Promise<void> {
        this.pgClient.query("BEGIN;");
        Promise.all(this.pendingCommands.map(async (command): Promise<void> => {
            
        }));
        this.pgClient.query("COMMIT;");
        this.pendingCommands = [];
    }

    private async executeCommand(command: DatabaseCommand<any>): Promise<void> {
        const commandConfig = command.getQueryConfig();
        try {
            const result = await this.pgClient.query(commandConfig);
            const followUpCommands = command.setDatabaseResult(this, result);
        } catch {
            log(2, "database command failed: " + commandConfig.text);          
        }
    }

    /**
     * saves all nodes in the cache and clears the cache
     * WARNING: it is forbidden to use already existing nodes any longer!
     * this will result in serious errors and may affect database consitency!
     */
    public async saveAndClearCache() {
        await this.executePendingCommands();
        this.nodes.forEach(node => {
            if (node.isChanged()) {
                node.save();
            }
        });
        await this.executePendingCommands();
        this.nodes.clear();
    }
    
}