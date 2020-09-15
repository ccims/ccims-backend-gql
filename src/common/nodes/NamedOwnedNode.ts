import { DatabaseManager } from "../database/DatabaseManager";
import { NamedNode, NamedNodeTableSpecification } from "./NamedNode";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { NodeProperty } from "./properties/NodeProperty";
import { NodePropertySpecification } from "./properties/NodePropertySpecification";
import { User } from "./User";

export const NamedOwnedNodeTableSpecification: NodeTableSpecification<NamedOwnedNode>
    = new NodeTableSpecification<NamedOwnedNode>("node", NamedNodeTableSpecification, 
        new RowSpecification("owner_user_id", component => component.id));

export class NamedOwnedNode<T extends NamedOwnedNode = any> extends NamedNode<T> {
    public readonly ownerProperty: NodeProperty<User, NamedOwnedNode>;

    private static readonly ownerPropertySpecification: NodePropertySpecification<User, NamedOwnedNode>
        = new NodePropertySpecification<User, NamedOwnedNode>(
            (id, node) => {
                const command  = undefined as any;
                command.ids = [id];
                return command;
            },
            node => {
                //TODO reload command
                return undefined as any;
            }
            //TODO notify user
        );

    protected constructor (type: NodeType, databaseManager: DatabaseManager, tableSpecification: NodeTableSpecification<T>, id: string, name: string, description: string, ownerId: string) {
        super(type, databaseManager, tableSpecification, id, name, description);
        this.ownerProperty = this.registerSaveable(new NodeProperty<User, NamedOwnedNode>(databaseManager, NamedOwnedNode.ownerPropertySpecification, this, ownerId));
    }
}