import { Color } from "../../common/Color";
import { Label } from "../../common/nodes/Label";
import { SyncProperty } from "../properties/SyncProperty";
import { SyncPropertySpecification } from "../properties/SyncPropertySpecification";
import { SyncNamedNode } from "./SyncNamedNode";

/**
 * Sync wrapper for Label
 */
export class SyncLabel extends SyncNamedNode<Label> {
    
    /**
     * Specification for the color property
     */
    private static readonly colorPropertySpecification: SyncPropertySpecification<Color, Label, SyncLabel> = {
        apply: async (item, node) => {
            node.node.color = item.value;
            return undefined;
        },
        applyHistoric: async () => undefined,
        getCurrentStatus: async node => {
            return {
                lastUpdatedAt: node.node.lastEditedAt,
                currentValue: node.node.color
            };
        }
    }

    /**
     * Property to update the color of the Label
     */
    public readonly colorProperty: SyncProperty<Color, Label, SyncLabel>;

    /**
     * Creates a new SyncLabel based on the provided label
     * @param node the underlaying node
     */
    public constructor(node: Label) {
        super(node);

        this.colorProperty = this.registerSyncModifiable(new SyncProperty(SyncLabel.colorPropertySpecification, this));
    }
}