import { User } from "../../common/nodes/User";
import { SyncUpdate } from "../SyncUpdate";
import { SyncNodeWrapper } from "../nodes/SyncNodeWrapper";
import { SyncModifiable } from "../SyncModifiable";
import { SyncPropertySpecification } from "./SyncPropertySpecification";
import { SyncValue } from "./SyncValue";
import { CCIMSNode } from "../../common/nodes/CCIMSNode";

/**
 * Property used to sync a property
 * Sync policy:
 * all changes with a date are applied in the correct order, however all older than the latest
 * current change only as historic event (a timeline entry may be created, however the current state is not changed)
 * If there is a change with a date, all changes without a date are dropped.
 * If there are only changes without a date, the last one with a specified user is taken.
 */
export class SyncProperty<T, V extends CCIMSNode, C extends SyncNodeWrapper<V>> implements SyncModifiable {

    /**
     * Sync wrapper which contains the node to which updates are applied
     */
    private readonly _node: C;

    /**
     * The specification for the node, specifies apply functions
     */
    private readonly _specification: SyncPropertySpecification<T, V, C>;

    /**
     * contains all the added items (not applied yet)
     */
    private readonly _setValues: SyncValue<T>[] = [];

    public constructor(specification: SyncPropertySpecification<T, V, C>, node: C) {
        this._node = node;
        this._specification = specification;
    }

    /**
     * Sets a value to the property
     * @param value the new value of the property
     * @param asUser the user who added the item
     * @param atDate the timestamp when the item was added
     */
    public set(value: T, asUser: User | undefined, atDate: Date | undefined) {
        this._setValues.push({
            value: value,
            asUser: asUser,
            atDate: atDate
        });
    }

    /**
     * Applies the changes to the underlying node
     * @returns updates from the apply
     */
    public async apply(): Promise<SyncUpdate[]> {
        if (this._setValues.length === 0) {
            return [];
        } else if (this._setValues.some(value => value.atDate !== undefined)) {
            const filteredValues = this._setValues.filter(value => value.atDate !== undefined);
            filteredValues.sort((a, b) => b.atDate!.getTime() - a.atDate!.getTime());
            return this.applyInternal(filteredValues);
        } else {
            let value: SyncValue<T> | undefined;
            for (let i = this._setValues.length - 1; i >= 0; i--) {
                if (this._setValues[i].asUser !== undefined) {
                    value = this._setValues[i];
                    break;
                }
            }
            if (value === undefined) {
                value = this._setValues[this._setValues.length - 1];
            }

            return this.applyInternal([value]);
        }
    }

    /**
     * Applies all changes
     * values must akready be filtered and sorted, and only include updates which should be applied
     * @param values the changes which are applied
     * @returns the updates resulting from the applied changes
     */
    private async applyInternal(values: SyncValue<T>[]): Promise<SyncUpdate[]> {
        const status = await this._specification.getCurrentStatus(this._node);
        const lastValue = values[values.length - 1];
        if (lastValue.value !== status.currentValue 
            && (status.lastUpdatedAt === undefined || lastValue.atDate === undefined || status.lastUpdatedAt < lastValue.atDate)) {
            values.pop();
            const updates = await this.applyHistoric(values);
            const update = await this._specification.apply(lastValue, this._node);
            if (update !== undefined) {
                updates.push(update);
            }
            return updates;
        } else {
            return this.applyHistoric(values);
        }
    }

    /**
     * Applies changes as historic events
     * @param values the changages which should be applied
     * @returns the updates from applying the changes
     */
    private async applyHistoric(values: SyncValue<T>[]): Promise<SyncUpdate[]> {
        const updates: SyncUpdate[] = [];
        for (const value of values) {
            const update = await this._specification.apply(value, this._node);
            if (update !== undefined) {
                updates.push(update);
            }
        }
        return updates;
    }
}