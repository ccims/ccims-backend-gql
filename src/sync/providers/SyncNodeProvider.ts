import { LoadNodeListCommand } from "../../common/database/commands/load/nodes/LoadNodeListCommand";
import { SyncNode } from "../../common/nodes/SyncNode";
import { SyncUpdate } from "../SyncUpdate";
import { SyncModifiable } from "../SyncModifiable";
import { SyncNodeWrapper } from "../nodes/SyncNodeWrapper";
import { SyncNodeProviderSpecification } from "./SyncNodeProviderSpecification";
import { NodeListProperty } from "../../common/nodes/properties/NodeListProperty";

/**
 * Provides sync functionality for SyncNodes
 * Base class for property based version and DatabaseManager based version
 */
export class SyncNodeProvider<V extends SyncNode, C extends SyncNodeWrapper<V>, T extends LoadNodeListCommand<V>> implements SyncModifiable {

    /**
     * The specification used to create wrapper classes and load commands
     */
    private readonly _specification: SyncNodeProviderSpecification<V, C, T>;

    /**
     * Map used to cache C wrapper classses
     */
    private _elements: Map<string, C> = new Map();

    /**
     * Creates a new SyncNodeProvider
     * @param specification specifies functions to create load commands and wrapper
     * @param property the property used to execute commands and get a single element by id
     */
    public constructor(specification: SyncNodeProviderSpecification<V, C, T>, private readonly property: NodeListProperty<any, any>) {
        this._specification = specification;
    }

    /**
     * Gets all elements
     */
    public async getElements(): Promise<C[]> {
        const command = this._specification.createCommand();
        const elements = await this.executeCommand(command);
        return this.mapElements(elements);
    }

    /**
     * Gets all elements which have been modified since the specified date
     * Date refers to the modification timestramp from the database, and not the user provided creation / edit date
     * Should also include nodes with modified subnodes
     * @param date the date since when the returned elements must have been modified
     */
    public async getElementsModifiedSince(date: Date): Promise<C[]> {
        const command = this._specification.createCommand(date);
        const elements = await this.executeCommand(command);
        return this.mapElements(elements);
    }

    /**
     * Gets a specific element by id
     * @param id the id of the element
     */
    public async getElement(id: string): Promise<C | undefined> {
        if (this._elements.has(id)) {
            return this._elements.get(id);
        } else {
            const element = await this.getElementById(id);
            if (element !== undefined) {
                return this.mapElements([element])[0];
            } else {
                return undefined;
            }
        }
    }

    /**
     * Maps the provided elements to its wrapper type
     * @param elements the elements which should be mapped
     */
    private mapElements(elements: V[]): C[] {
        return elements.map(element => {
            if (this._elements.has(element.id)) {
                return this._elements.get(element.id)!;
            } else {
                const wrapper = this._specification.createWrapper(element);
                this._elements.set(element.id, wrapper);
                return wrapper;
            }
        });
    }

    /**
     * Applies all updates to the underlying node
     * @returns updates from the apply
     */
    public async apply(): Promise<SyncUpdate[]> {
        return (await Promise.all([...this._elements.values()].map(element => element.apply()))).flat();
    }

    /**
     * Get a single element by id
     * @param id the id of the element
     * @returns the element
     */
    private async getElementById(id: string): Promise<V | undefined> {
        const command = this._specification.createCommand(undefined);
        command.ids = [id];
        return (await this.executeCommand(command))[0];
    }

    /**
     * Executes a DatabaseCommand and returns the nodes
     * @param command the command which is executed
     * @returns the result of the command
     */
    private async executeCommand(command: T): Promise<V[]> {
        return this.property.getFilteredElements(command);
    }

}