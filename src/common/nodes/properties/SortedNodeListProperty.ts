import { DatabaseManager } from "../../database/DatabaseManager";
import { CCIMSNode } from "../CCIMSNode";
import { LoadLevel, NodeListProperty } from "./NodeListProperty";
import { NodeListPropertySpecification } from "./NodeListPropertySpecification";

/**
 * NodeListProperty which maintaines an order for the elements specified by the comparator
 * The order is maintained, even when elements are added or removed
 */
export class SortedNodeListProperty<T extends CCIMSNode, V extends CCIMSNode> extends NodeListProperty<T, V> {

    /**
     * Sorted elements list
     */
    private _sortedElements: T[] = [];

    /**
     * create a new NodesProperty with the provided specification
     * @param databaseManager the databaseManager used to execute DatabaseCommands
     * @param specification the specification for the command
     * @param node the node proviced to all generators as last parameter
     * @param comparator the comparison function for the elements order
     */
     public constructor(databaseManager: DatabaseManager, specification: NodeListPropertySpecification<T, V>, node: V, private readonly comparator: (a: T, b: T) => number) {
        super(databaseManager, specification, node);
    }

    /**
     * Get all sorted elements
     */
    public async getSortedElements(): Promise<T[]> {
        await this.ensureLoadLevel(LoadLevel.Complete);
        return this._sortedElements;
    }

    /**
     * Sets an element
     * Can be overwritten to implement additional behaviour
     * Note: this method can be improved significantly if necessary by implementing a QuickSelection based insertion
     * @param element the element to set
     */
    protected setElement(element: T): void {
        super.setElement(element);
        this._sortedElements.push(element);
        this._sortedElements.sort(this.comparator);
    }

    /**
     * Replaces the elements
     * Can be overwritten to implement additional behaviour
     * @param newElements the new map of elements
     */
    protected replaceElements(newElements: Map<string, T>): void {
        super.replaceElements(newElements);
        this._sortedElements = [...newElements.values()];
        this._sortedElements.sort(this.comparator);
    }

    /**
     * Deletes an element
     * Can be overwritten to implement additional behaviour
     * @param id the id of the element to delete
     */
    protected deleteElement(id: string): void {
        super.deleteElement(id);
        this._sortedElements = this._sortedElements.filter(element => element.id !== id);
    }

}