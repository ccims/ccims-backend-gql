import { NamedSyncNode } from "../../common/nodes/NamedSyncNode";
import { SyncProperty } from "../properties/SyncProperty";
import { SyncPropertySpecification } from "../properties/SyncPropertySpecification";
import { SyncNodeWrapper } from "./SyncNodeWrapper";

/**
 * Sync wrapper for NamedSyncNode
 */
export class SyncNamedNode<T extends NamedSyncNode> extends SyncNodeWrapper<T> {

    /**
     * Cache for lastUpdatedAt
     * necessary, because updating the first property might affect this
     */
    private _lastUpdatedAt: Date;
    
    /**
     * Specification for the name property
     */
    private static readonly namePropertySpecification: SyncPropertySpecification<string, NamedSyncNode, SyncNamedNode<NamedSyncNode>> = {
        apply: async (item, node) => {
            node.node.setName(item.value, item.atDate ?? new Date());
            return undefined;
        },
        applyHistoric: async () => undefined,
        getCurrentStatus: async node => {
            return {
                lastUpdatedAt: node.lastUpdatedAt,
                currentValue: node.node.name
            };
        }
    }

    /**
     * Property to update the name of the NamedSyncNode
     */
    public readonly nameProperty: SyncProperty<string, NamedSyncNode, SyncNamedNode<NamedSyncNode>>;

    
    /**
     * Specification for the description property
     */
    private static readonly descriptionPropertySpecification: SyncPropertySpecification<string, NamedSyncNode, SyncNamedNode<NamedSyncNode>> = {
        apply: async (item, node) => {
            node.node.setDescription(item.value, item.atDate ?? new Date());
            return undefined;
        },
        applyHistoric: async () => undefined,
        getCurrentStatus: async node => {
            return {
                lastUpdatedAt: node.lastUpdatedAt,
                currentValue: node.node.description
            };
        }
    }

    /**
     * Property to update the description of the NamedSyncNode
     */
    public readonly descriptionProperty: SyncProperty<string, NamedSyncNode, SyncNamedNode<NamedSyncNode>>;

    /**
     * Creates a new SyncNamedNode based on the provided T
     * @param node the underlaying node
     */
    protected constructor(node: T) {
        super(node);

        this.nameProperty = this.registerSyncModifiable(new SyncProperty(SyncNamedNode.namePropertySpecification, this));
        this.descriptionProperty = this.registerSyncModifiable(new SyncProperty(SyncNamedNode.descriptionPropertySpecification, this));
        this._lastUpdatedAt = node.lastUpdatedAt;
    }

    /**
     * Gets the initial state of node.lastUpdatedAt
     */
    protected get lastUpdatedAt(): Date {
        return this._lastUpdatedAt;
    }

}