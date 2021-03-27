import { SyncNode } from "../../common/nodes/SyncNode";
import { User } from "../../common/nodes/User";
import { SyncUpdate } from "../SyncUpdate";
import { SyncNodeWrapper } from "../nodes/SyncNodeWrapper";
import { SyncListPropertySpecification } from "./SyncListPropertySpecification";
import { SyncModifiable } from "../SyncModifiable";
import { SyncValue } from "./SyncValue";

/**
 * Property used to add / remove elements to / from a property
 * Sync policy:
 * all changes with a date are applied in the correct order, however all older than the latest
 * current change only as historic event (a timeline entry may be created, however the current state is not changed)
 * If there is a change with a date, all changes without a date are dropped.
 * If there are only changes without a date, the last one with a specified user is taken.
 */
export class SyncListProperty<T, V extends SyncNode, C extends SyncNodeWrapper<V>> implements SyncModifiable {
    /**
     * Sync wrapper which contains the node to which updates are applied
     */
    private readonly _node: C;

    /**
     * The specification for the node, specifies apply functions
     */
    private readonly _specification: SyncListPropertySpecification<T, V, C>;

    /**
     * contains all the changed items (not applied yet)
     */
    private readonly _changedItems: Map<T, SyncValue<boolean>[]> = new Map();


    public constructor(specification: SyncListPropertySpecification<T, V, C>, node: C) {
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
            value: true,
            asUser: asUser,
            atDate: atDate
        }

        this.addChangedValue(item, value);
    }

    /**
     * Removes an item from the property
     * @param item the item removed from the property
     * @param asUser the user who removed the item
     * @param atDate the timestamp when the item was removed
     */
    public remove(item: T, asUser: User | undefined, atDate: Date | undefined) {
        const value = {
            value: false,
            asUser: asUser,
            atDate: atDate
        }

        this.addChangedValue(item, value);
    }

    /**
     * Adds a change to the changes list
     * @param item the item which was added / removed
     * @param value the SyncValue which represents 
     */
    private addChangedValue(item: T, value: SyncValue<boolean>): void {
        if (this._changedItems.has(item)) {
            this._changedItems.get(item)?.push(value);
        } else {
            this._changedItems.set(item, [value]);
        }
    }

    /**
     * Applies the changes to the underlying node
     * should only be called ONCE
     * @returns all updates fro the sync
     */
    public async apply(): Promise<SyncUpdate[]> {
        const updates = await Promise.all([...this._changedItems.entries()].map(([item, value]) => this.applyChangedItem(item, value)));
        return updates.flat(1);
    }

    /**
     * Synces a single item
     * @param item the item to sync
     * @param values all changes to the status of the item
     */
    private async applyChangedItem(item: T, values: SyncValue<boolean>[]): Promise<SyncUpdate[]> {
        if (values.length === 0) {
            return [];
        } else if (values.some(value => value.atDate !== undefined)) {
            const filteredValues = values.filter(value => value.atDate !== undefined);
            filteredValues.sort((a, b) => b.atDate!.getTime() - a.atDate!.getTime());
            return this.applyChangedItemInternal(item, filteredValues);
        } else {
            let value: SyncValue<boolean> | undefined;
            for (let i = values.length - 1; i >= 0; i--) {
                if (values[i].asUser !== undefined) {
                    value = values[i];
                    break;
                }
            }
            if (value === undefined) {
                value = values[values.length - 1];
            }

            return this.applyChangedItemInternal(item, [value]);
        }
    }

    /**
     * Syncs a single item
     * values must already be filtered and sorted, and only include the items which should be applied
     * also each entry in values must have a specified atDate
     * Warning: values might be changed!
     * @param item the item which is updated
     * @param values all values which should be applied. These must must be sorted by date, and there must be at least 1 value
     * @returns the updates from applying the changes
     */
    private async applyChangedItemInternal(item: T, values: SyncValue<boolean>[]): Promise<SyncUpdate[]> {
        const status = await this._specification.getCurrentStatus(item, this._node);
        const lastValue = values[values.length - 1];
        if (lastValue.value !== status.currentStatus 
            && (status.lastUpdatedAt === undefined || lastValue.atDate === undefined || status.lastUpdatedAt < lastValue.atDate)) {
            values.pop();
            const updates = await this.applyChangedItemHistoric(item, values);
            const update = await this.applyCurrentChange(item, lastValue);
            if (update !== undefined) {
                updates.push(update);
            }
            return updates;
        } else {
            return this.applyChangedItemHistoric(item, values);
        }
    }

    /**
     * Syncs a single item by applying all hisoric events
     * @param item the item which is updated
     * @param values all values which should be applied as historic events. These must be sorted by date, might be empty
     * @returns the updates from applying the historc events
     */
    private async applyChangedItemHistoric(item: T, values: SyncValue<boolean>[]): Promise<SyncUpdate[]> {
        const updates: SyncUpdate[] = [];
        for (const value of values) {
            if (value.value) {
                const update = await this._specification.applyAddHistoric({
                    value: item,
                    asUser: value.asUser,
                    atDate: value.atDate,
                }, this._node);
                if (update !== undefined) {
                    updates.push(update);
                }
            } else {
                const update = await this._specification.applyRemoveHistoric({
                    value: item,
                    asUser: value.asUser,
                    atDate: value.atDate,
                }, this._node);
                if (update !== undefined) {
                    updates.push(update);
                }
            }
        }
        return updates;
    }

    /**
     * Applioes the current change to an item
     * @param item the item which is updated
     * @param value the last change which is applied as current change
     * @returns the update from the applyAdd or applyRemove
     */
    private async applyCurrentChange(item: T, value: SyncValue<boolean>): Promise<SyncUpdate | undefined> {
        if (value.value) {
            return this._specification.applyAdd({
                value: item,
                asUser: value.asUser,
                atDate: value.atDate,
            }, this._node);
        } else {
            return this._specification.applyRemove({
                value: item,
                asUser: value.asUser,
                atDate: value.atDate,
            }, this._node);
        }
    }
}