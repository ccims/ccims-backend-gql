import { ImsSystem } from "../../../common/nodes/ImsSystem";
import { SyncNode } from "../../../common/nodes/SyncNode";
import { User } from "../../../common/nodes/User";
import { SyncUpdate } from "../../SyncUpdate";
import { SyncNodeContainer } from "../SyncNodeContainer";
import { SyncPropertyBase } from "./SyncPropertyBase";
import { SyncPropertySpecification } from "./SyncPropertySpecification";
import { findBestSyncValue, SyncValue } from "./SyncValue";

export class SyncProperty<T, V extends SyncNode> implements SyncPropertyBase {

    /**
     * Sync container which contains the node to which updates are applied
     */
    private readonly _node: SyncNodeContainer<V>;

    /**
     * The specification for the node, specifies apply functions
     */
    private readonly _specification: SyncPropertySpecification<T, V>;

    /**
     * contains all the added items (not applied yet)
     */
    private readonly _setValues: SyncValue<T>[] = [];

    /**
     * The update which can be applied
     */
    private update?: SyncUpdate;

    /**
     * The ims which alreay are synced correctly
     */
    private sourceIms: ImsSystem[] = [];

    public constructor(specification: SyncPropertySpecification<T, V>, node: SyncNodeContainer<V>) {
        this._node = node;
        this._specification = specification;
    }

    /**
     * Sets a value to the property
     * @param value the new value of the property
     * @param asUser the user who added the item
     * @param atDate the timestamp when the item was added
     * @param ims the IMS where the item was added
     */
    public set(value: T, asUser: User | undefined, atDate: Date | undefined, ims: ImsSystem) {
        this._setValues.push({
            value: value,
            asUser: asUser,
            atDate: atDate,
            ims: ims
        });
    }

    /**
     * Applies the changes to the underlying node
     */
    public async apply(): Promise<void> {
        if (this._setValues.length > 0) {
            const bestValue = findBestSyncValue(this._setValues);
            this.update = await this._specification.applyChange(bestValue, this._node.node);
            this.sourceIms.push(...this._setValues
                .filter(value => value.value == bestValue.value)
                .map(value => value.ims));
        }
    }

    /**
     * Gets all updates that have to be applied to the specified ims
     * @param ims the IMS on which the updates have to be applied
     * @returns all updates that should be applied on the specified IMS
     */
    public getUpdates(ims: ImsSystem): SyncUpdate[] {
        if (this.update != undefined && !this.sourceIms.includes(ims)) {
            return [this.update];
        } else {
            return [];
        }
    }
    
}