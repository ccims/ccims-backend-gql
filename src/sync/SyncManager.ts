import { Pool } from "pg";
import { LoadSyncLookupTableEntryCommand } from "../common/database/commands/load/LoadSyncLookupTableEntryCommand";
import { SetSyncLookupTableEntryCommand } from "../common/database/commands/save/SetSyncLookupTableEntryCommand";
import { DatabaseManager } from "../common/database/DatabaseManager";
import { Component } from "../common/nodes/Component";
import { SnowflakeGenerator } from "../utils/Snowflake";
import { SyncComponent } from "./nodes/SyncComponent";
import { SyncAdapter } from "./adapter/SyncAdapter";
import { SyncModifiableContainer } from "./SyncModifiableContainer";
import { IMSSystem } from "../common/nodes/IMSSystem";
import { IMSComponent } from "../common/nodes/IMSComponent";

/**
 * Class which provides nodes for sync
 */
export class SyncManager extends SyncModifiableContainer {

    /**
     * if true all changes are discarded
     */
    private _discardChanges: boolean = false;

    /**
     * The component which is currently synced
     * This is lazy-loaded
     */
    private _component: SyncComponent | undefined;

    /**
     * The IMSComponent which is currently synced
     * This is lazy-loaded
     */
    private _imsComponent: IMSComponent | undefined;

    /**
     * The DatabaseManager used to load nodes and execute commands
     */
    private readonly _databaseManager: DatabaseManager;

    /**
     * Cache for lookup table entries
     */
    private readonly lookupTableCache: Map<string, string | undefined> = new Map();

    /**
     * Stores changes for the loopup tables
     */
    private readonly lookupTableChanges: Map<string, string | undefined> = new Map();

    /**
     * Creates a new SyncManager
     * @param imsComponentId the id of the ims associated with the component
     */
    public constructor(private readonly imsComponentId: string, idGenerator: SnowflakeGenerator, pool: Pool) {
        super();
        this._databaseManager = new DatabaseManager(idGenerator, pool, imsComponentId);
    }

    /**
     * Gets the component which is synced
     */
    public async component(): Promise<SyncComponent> {
        if (this._component === undefined) {
            const component = await (await this.imsComponent()).component();
            if (component === undefined) {
                throw new Error("no component found");
            }
            this._component = this.registerSyncModifiable(new SyncComponent(component));
        }
        return this._component;
    }

    /**
     * Gets the ims which is synced
     */
    public async imsComponent(): Promise<IMSComponent> {
        if (this._imsComponent === undefined) {
            this._imsComponent = await this.databaseManager.getNode(this.imsComponentId) as IMSComponent;
        }
        return this._imsComponent;
    }

    /**
     * Gets the databaseManager
     */
    public get databaseManager(): DatabaseManager {
        return this._databaseManager;
    }

    /**
     * Performs the sync and returns if the sync was successfull
     * @param adapter the adapter to perform the sync with
     * @returns true if the sync was performed, otherwise false
     */
    public async performSync(adapter: SyncAdapter): Promise<boolean> {
        if (await adapter.canSync(await this.imsComponent())) {
            await adapter.sync(this);
            if (!this._discardChanges) {
                await this.saveChanges();
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * Saves all changes
     */
    private async saveChanges(): Promise<void> {
        await this.databaseManager.saveAndClearCache();
        for (const lookupTableEntry of this.lookupTableChanges.entries()) {
            const setCommand = new SetSyncLookupTableEntryCommand(lookupTableEntry[0], this.imsComponentId, lookupTableEntry[1]);
            this.databaseManager.addCommand(setCommand);
        }
        await this.databaseManager.executePendingCommands();
    }


    /**
     * Aborts the Sync, all changes are not saved
     * This includes new nodes, deleted nodes, and updated nodes
     * Additionaly, changes to the ims lookup table are not saved
     */
    public abortSync(): void {
        this._discardChanges = true;
    }

    /**
     * Gets a lookup table if existing, otherwise undefined
     * Can be used to map ims ids to ccims ids
     * @param id the id used by the ims of component
     */
    public async getLookupTableValue(id: string): Promise<string | undefined> {
        if (this.lookupTableCache.has(id)) {
            return this.lookupTableCache.get(id);
        } else {
            const loadCommand = new LoadSyncLookupTableEntryCommand(id, this.imsComponentId);
            this.databaseManager.addCommand(loadCommand);
            await this.databaseManager.executePendingCommands();
            this.lookupTableCache.set(id, loadCommand.getResult())
            return loadCommand.getResult();
        }
    }

    /**
     * Sets a lookup table value
     * @param id the id used by the ims of the component
     * @param value the ccims id, undefined to remove the entry
     */
    public setLoopkupTableValue(id: string, value: string | undefined): void {
        this.lookupTableCache.set(id, value);
        this.lookupTableChanges.set(id, value);
    }
}