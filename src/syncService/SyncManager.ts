import { Component } from "../common/nodes/Component";
import { SyncComponent } from "./nodes/SyncComponent";
import { SyncModifiableContainer } from "./SyncModifiableContainer";

/**
 * Class which provides nodes for sync
 */
export class SyncManager extends SyncModifiableContainer {

    /**
     * The component which is currently synced
     */
    private readonly _component: SyncComponent;

    /**
     * Creates a new SyncManager
     * @param component the component which is synced
     */
    public constructor(component: Component) {
        super();
        this._component = this.registerSyncModifiable(new SyncComponent(component));
    }

    /**
     * Gets the component which is synced
     */
    public get component(): SyncComponent {
        return this._component;
    }
}