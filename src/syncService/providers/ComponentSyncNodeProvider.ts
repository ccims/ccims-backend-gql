import { LoadNodeListCommand } from "../../common/database/commands/load/nodes/LoadNodeListCommand";
import { DatabaseManager } from "../../common/database/DatabaseManager";
import { Component } from "../../common/nodes/Component";
import { SyncNode } from "../../common/nodes/SyncNode";
import { SyncNodeWrapper } from "../nodes/SyncNodeWrapper";
import { SyncNodeProvider } from "./SyncNodeProvider";
import { SyncNodeProviderSpecification } from "./SyncNodeProviderSpecification";

/**
 * SyncNodeProvider based on a Component
 * Returns all nodes which are on the specified component
 */
 export class ComponentSyncNodeProvider<V extends SyncNode, C extends SyncNodeWrapper<V>, T extends (LoadNodeListCommand<V> & { onComponents?: string[]})> extends SyncNodeProvider<V, C, T> {

    private readonly _databaseManager: DatabaseManager;

    /**
     * Creates a new PropertySyncNodeProvider
     * @param specification specifies functions to create load commands and wrapper
     * @param property the property used to execute commands and get a single element by id
     */
    public constructor(specification: SyncNodeProviderSpecification<V, C, T>, private readonly component: Component) {
        super(specification);
        this._databaseManager = component.databaseManager;
    }

    /**
     * Executes a DatabaseCommand and returns the nodes
     * @param command the command which is executed
     * @returns the result of the command
     */
    protected async executeCommand(command: T): Promise<V[]> {
        command.onComponents = [this.component.id];
        this._databaseManager.addCommand(command);
        await this._databaseManager.executePendingCommands();
        return command.getResult();
    }
}