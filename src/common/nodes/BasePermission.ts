import { GetWithReloadCommand } from "../database/commands/GetWithReloadCommand";
import { LoadAuthorizablesCommand } from "../database/commands/load/nodes/LoadAuthorizablesCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { CCIMSNode, CCIMSNodeTableSpecification } from "./CCIMSNode";
import { CCIMSUser } from "./CCIMSUser";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { NodePropertySpecification } from "./properties/NodePropertySpecification";
import { NullableNodeProperty } from "./properties/NullableNodeProperty";
import { Role } from "./Role";

/**
 * the specification of the base table which contains permissions
 */
export const BasePermissionTableSpecification: NodeTableSpecification<BasePermission>
    = new NodeTableSpecification<BasePermission>("base_permission", CCIMSNodeTableSpecification,
        new RowSpecification("authorizable_id", permission => permission.authorizableProperty));


/**
 * Base class for all Permissions
 */
export class BasePermission<T extends BasePermission = any> extends CCIMSNode<T> {
    /**
     * property with the CCIMSUser or Role to which this permission is applied to
     */
    public readonly authorizableProperty: NullableNodeProperty<Role | CCIMSUser, BasePermission>;

    /**
     * specification for authorizableProperty
     */
    private static readonly authorizablePropertySpecification: NodePropertySpecification<Role | CCIMSUser, BasePermission>
        = new NodePropertySpecification<Role | CCIMSUser, BasePermission>(
            (id, node) => {
                const command = new LoadAuthorizablesCommand();
                command.ids = [id];
                return command;
            },
            node => new GetWithReloadCommand(node, "authorizable_id", new LoadAuthorizablesCommand()),
            (authorizable, node) => undefined as any
        );
    
    protected constructor(type: NodeType, databaseManager: DatabaseManager, tableSpecification: NodeTableSpecification<T>, id: string, authorizableId: string) {
        super(type, databaseManager, tableSpecification, id);

        this.authorizableProperty = new NullableNodeProperty<Role | CCIMSUser, BasePermission>(databaseManager, BasePermission.authorizablePropertySpecification, this, authorizableId);
    }
}