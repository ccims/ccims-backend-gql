import { ComponentInterface } from "../../common/nodes/ComponentInterface";
import { SyncNamedNode } from "./SyncNamedNode";

/**
 * Sync wrapper for ComponentInterface
 */
export class SyncComponentInterface extends SyncNamedNode<ComponentInterface> {

    /**
     * Creates a new SyncComponentInterface based on the provided componentinterface
     * @param node the underlaying node
     */
    public constructor(node: ComponentInterface) {
        super(node);
    }
}