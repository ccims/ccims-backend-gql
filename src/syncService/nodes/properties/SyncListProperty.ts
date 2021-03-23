import { ImsSystem } from "../../../common/nodes/ImsSystem";
import { SyncNode } from "../../../common/nodes/SyncNode";
import { User } from "../../../common/nodes/User";
import { SyncUpdate } from "../../SyncUpdate";
import { SyncNodeContainer } from "../SyncNodeContainer";
import { SyncListPropertySpecification } from "./SyncListPropertySpecification";
import { SyncPropertyBase } from "./SyncPropertyBase";
import { findBestSyncValue, SyncValue } from "./SyncValue";

/**
 * Property used to add / remove elements to / from a property
 */
export class SyncListProperty<T, V extends SyncNode> implements SyncPropertyBase {
    /**
     * Sync container which contains the node to which updates are applied
     */
    private readonly _node: SyncNodeContainer<V>;

    /**
     * The specification for the node, specifies apply functions
     */
    private readonly _specification: SyncListPropertySpecification<T, V>;

    /**
     * contains all the added items (not applied yet)
     */
    private readonly _addedItems: Map<T, SyncValue<T>[]> = new Map();

    /**
     * contains all the removed items (not applied yet)
     */
    private readonly _removedItems: Map<T, SyncValue<T>[]> = new Map();


    public constructor(specification: SyncListPropertySpecification<T, V>, node: SyncNodeContainer<V>) {
        this._node = node;
        this._specification = specification;
    }

    /**
     * Adds an item to the property
     * @param item the item added to the property
     * @param asUser the user who added the item
     * @param atDate the timestamp when the item was added
     */
    public add(item: T, asUser: User | undefined, atDate: Date | undefined) {
        const value = {
            value: item,
            asUser: asUser,
            atDate: atDate
        }

        if (this._addedItems.has(item)) {
            this._addedItems.get(item)?.push(value);
        } else {
            this._addedItems.set(item, [value]);
        }
    }

    /**
     * Removes an item from the property
     * @param item the item removed from the property
     * @param asUser the user who removed the item
     * @param atDate the timestamp when the item was removed
     */
    public remove(item: T, asUser: User | undefined, atDate: Date | undefined) {
        const value = {
            value: item,
            asUser: asUser,
            atDate: atDate
        }

        if (this._removedItems.has(item)) {
            this._removedItems.get(item)?.push(value);
        } else {
            this._removedItems.set(item, [value]);
        }
    }

    /**
     * Applies the changes to the underlying node
     */
    public async apply(): Promise<void> {
        await Promise.all([
            this.applyAdd(),
            this.applyRemove()
        ]);
    }

    /**
     * Applies (if possible) all added items
     */
    private async applyAdd(): Promise<void> {
        //TODO
    }

    /**
     * Applies (if possible) all added items
     */
    private async applyRemove(): Promise<void> {
        //TODO
    }
}