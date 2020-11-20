import { CCIMSNode } from "../nodes/CCIMSNode";
import { DatabaseCommand } from "./DatabaseCommand";
import { Client, ClientBase, Pool } from "pg";
import { log } from "../../log";
import { SnowflakeGenerator } from "../../utils/Snowflake";
import { LoadMultipleNodeListsCommand } from "./commands/load/nodes/LoadMultipleNodeListsCommand";
import { setTypeParser } from "pg-types"
import { IssueCategory, IssuePriority } from "../nodes/Issue";
import { ImsType } from "../nodes/ImsSystem";
import { Saveable } from "../nodes/Saveable";

/**
 * Adds database support, also has an IdGenerator
 * All nodes must be registered on this object
 */
export class DatabaseManager {

    /**
     * a map with all nodes
     */
    nodes: Map<string, CCIMSNode> = new Map<string, CCIMSNode>();

    /**
     * set with Saveables to save
     */
    toSave: Set<Saveable> = new Set();

    /**
     * the idGenerator
     */
    public readonly idGenerator: SnowflakeGenerator;

    /**
     * array with not executed commands
     */
    private pendingCommands: DatabaseCommand<any>[] = [];

    /**
     * the postgres pool
     */
    private readonly pool: Pool;

    /**
     * creates a new DatabaseManager with the specified id generator
     * normally, there should only be one DatabaseManager
     * @param idGenerator the idGenerator to generate new ids
     */
    public constructor(idGenerator: SnowflakeGenerator, pool: Pool) {
        this.idGenerator = idGenerator;
        this.pool = pool
    }

    /**
     * Adds the node to the internal node dictionary
     * This must be used to add new nodes, but also to register loaded nodes
     * Caution: if a node with the same id is already registered, it is overridden
     * @param node the node to register
     */
    public addCachedNode(node: CCIMSNode): void {
        this.nodes.set(node.id, node);
    }

    /**
     * gets the node with the associated id or undefined if not found
     * @param id the id for the node to get
     */
    public getCachedNode(id: string): CCIMSNode | undefined {
        return this.nodes.get(id);
    }

    /**
     * gets the node if it is already cached, otherwise it loads it
     * @param id the id for the node to get
     */
    public async getNode(id: string): Promise<CCIMSNode | undefined> {
        const cachedNode = this.getCachedNode(id);
        if (cachedNode) {
            return cachedNode;
        } else {
            const loadCommand = new LoadMultipleNodeListsCommand("node");
            loadCommand.ids = [id];
            this.addCommand(loadCommand);
            await this.executePendingCommands();
            return loadCommand.getResult()[0];
        }
    }

    /**
     * add a DatabaseCommand to the pending command collection
     * this does not execute command, to do this @see executePendingCommands
     * @param command the command to add
     */
    public addCommand(command: DatabaseCommand<any>): void {
        this.pendingCommands.push(command);
        command.subCommands.forEach(cmd => this.addCommand(cmd));
    }

    /**
     * executes all pending commands in a transaction
     * after this, it is possible to get the result of each command
     */
    public async executePendingCommands(): Promise<void> {
        if (this.pendingCommands.length > 0) {
            const pending = this.pendingCommands;
            this.pendingCommands = [];
            const client = await this.pool.connect();
            try {
                await client.query("BEGIN;");
                await Promise.all(pending.map(cmd => this.executeCommand(cmd, client)));
                await client.query("COMMIT;");
            } catch (e) {
                await client.query("ROLLBACK;");
                log(2, "database command failed");
                log(8, e);
            }
            client.release();
        }
    }

    /**
     * executes a single command
     * @param command the command to execute
     */
    private async executeCommand(command: DatabaseCommand<any>, client: ClientBase): Promise<void> {
        const commandConfig = command.getQueryConfig();
        log(8, commandConfig);
        let result;
        result = await client.query(commandConfig);
        const followUpCommands = command.setDatabaseResult(this, result);
        await Promise.all(followUpCommands.map(cmd => this.executeCommand(cmd, client)));
        command.notifyFollowUpCommandsResult(this, followUpCommands);
    }

    /**
     * saves all nodes in the cache and clears the cache
     * WARNING: it is forbidden to use already existing nodes any longer!
     * this will result in serious errors and may affect database consitency!
     */
    public async saveAndClearCache(): Promise<void> {
        await this.save();
        this.nodes.clear();
    }

    /**
     * saves all nodes
     */
    public async save(): Promise<void> {
        await this.executePendingCommands();
        this.toSave.forEach(saveable => {
            if (saveable.isChanged) {
                saveable.save();
            }
        });
        await this.executePendingCommands();
        this.toSave.clear();
    }

    /**
     * adds a savable to save
     * @param saveable the saveable which will be saved with the next save
     */
    public addChanged(saveable: Saveable): void {
        this.toSave.add(saveable);
    }
}

export async function initTypeParsers(client: ClientBase): Promise<void> {
    const issueCategoryOid = (await client.query("SELECT 'issue_category'::regtype::oid;")).rows[0].oid;
    const priorityOid = (await client.query("SELECT 'priority'::regtype::oid;")).rows[0].oid;
    const imsTypeOid = (await client.query("SELECT 'ims_type'::regtype::oid;")).rows[0].oid;
    setTypeParser(issueCategoryOid, value => IssueCategory[value as keyof typeof IssueCategory]);
    setTypeParser(priorityOid, value => IssuePriority[value as keyof typeof IssuePriority]);
    setTypeParser(imsTypeOid, value => ImsType[value as keyof typeof ImsType]);
}