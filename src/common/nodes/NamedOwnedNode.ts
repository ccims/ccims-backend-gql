import { GetWithReloadCommand } from "../database/commands/GetWithReloadCommand";
import { LoadUsersCommand } from "../database/commands/load/nodes/LoadUsersCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { DeletedNodes } from "./DeletedNodes";
import { NamedNode, NamedNodeTableSpecification } from "./NamedNode";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { NodeProperty } from "./properties/NodeProperty";
import { NodePropertySpecification } from "./properties/NodePropertySpecification";
import { User } from "./User";

/**
 * specification of a table which contains NamedOwnedNodes
 */
export const NamedOwnedNodeTableSpecification: NodeTableSpecification<NamedOwnedNode>
    = new NodeTableSpecification<NamedOwnedNode>("node", NamedNodeTableSpecification,
        new RowSpecification("owner_user_id", component => component.id));

/**
 * a NamedOwnedNode is a NamedNode with an owner
 */
export class NamedOwnedNode<T extends NamedOwnedNode = any> extends NamedNode<T> {
    /**
     * the owner property which contains the owner of this node
     */
    public readonly ownerProperty: NodeProperty<User, NamedOwnedNode>;

    /**
     * specification of the ownerProperty
     */
    private static readonly ownerPropertySpecification: NodePropertySpecification<User, NamedOwnedNode>
        = new NodePropertySpecification<User, NamedOwnedNode>(
            (id, node) => {
                const command = new LoadUsersCommand();
                command.ids = [id];
                return command;
            },
            node => new GetWithReloadCommand(node, "owner_user_id", new LoadUsersCommand()),
            DeletedNodes.User,
            (user, node) => user.ownedNodesProperty
        );

    /**
     * Async getter funtion for the ownerProperty
     * @returns A promise of the user owning this node
     */
    public async owner(): Promise<User> {
        return this.ownerProperty.get();
    }

    /**
     * abstract constructor for subclasses
     * @param type the type
     * @param databaseManager the databaseManager
     * @param tableSpecification teh table specification
     * @param id the id of the NamedNode
     * @param name the name of the NamedNode
     * @param description the description of the NamedNode
     * @param ownerId the id of the owner of the NamedNode
     */
    protected constructor(type: NodeType, databaseManager: DatabaseManager, tableSpecification: NodeTableSpecification<T>, id: string, name: string, description: string, ownerId: string) {
        super(type, databaseManager, tableSpecification, id, name, description);
        this.ownerProperty = new NodeProperty<User, NamedOwnedNode>(databaseManager, NamedOwnedNode.ownerPropertySpecification, this, ownerId);
    }

    /**
     * marks this node as deleted
     * this also marks this node as changed
     */
    public async markDeleted(): Promise<void> {
        if(!this.isDeleted) {
            await super.markDeleted();
            await this.ownerProperty.markDeleted();
        }
    }
}