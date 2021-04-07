import { LoadNodeListCommand } from "../../common/database/commands/load/nodes/LoadNodeListCommand";
import { SyncNode } from "../../common/nodes/SyncNode";
import { SyncNodeWrapper } from "../nodes/SyncNodeWrapper";

/**
 * Specification for a SyncNodeProvider
 * specifies a function to create wrapper classes, and a function to create load commands
 */
export interface SyncNodeProviderSpecification<V extends SyncNode, C extends SyncNodeWrapper<V>, T extends LoadNodeListCommand<V>> {
    /**
     * Creates a wrapper out of a node
     * @param node the node to create the wrapper from
     * @returns the created wrapper
     */
    createWrapper(node: V): C;
    /**
     * Creates a DatabaseCommand to load V nodes
     * @param modifiedSince all nodes which were modified since the specified date should be loaded
     *                      all nodes should be loaded if undefined is provided
     * @returns the command to load the nodes
     */
    createCommand(modifiedSince?: Date): T;
}