import { LoadNodeListCommand } from "../../common/database/commands/load/nodes/LoadNodeListCommand";
import { CCIMSNode } from "../../common/nodes/CCIMSNode";
import { NodeListProperty } from "../../common/nodes/properties/NodeListProperty";
import { SyncNode } from "../../common/nodes/SyncNode";
import { SyncNodeWrapper } from "../nodes/SyncNodeWrapper";
import { SyncNodeProvider } from "./SyncNodeProvider";
import { SyncNodeProviderSpecification } from "./SyncNodeProviderSpecification";

/**
 * SyncNodeProvider based on a NodeListProperty
 */
export class PropertySyncNodeProvider<V extends SyncNode, C extends SyncNodeWrapper<V>, T extends LoadNodeListCommand<V>> extends SyncNodeProvider<V, C, T> {

    /**
     * Creates a new PropertySyncNodeProvider
     * @param specification specifies functions to create load commands and wrapper
     * @param property the property used to execute commands and get a single element by id
     */
    public constructor(specification: SyncNodeProviderSpecification<V, C, T>, private readonly property: NodeListProperty<any, any>) {
        super(specification);
    }

    /**
     * Executes a DatabaseCommand and returns the nodes
     * @param command the command which is executed
     * @returns the result of the command
     */
    protected async executeCommand(command: T): Promise<V[]> {
        return this.property.getFilteredElements(command);
    }
}