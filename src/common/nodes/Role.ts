import { LoadRelationCommand } from "../database/commands/load/LoadRelationCommand";
import { LoadPermissionsCommand } from "../database/commands/load/nodes/LoadPermissionsCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { BasePermission } from "./BasePermission";
import { NamedNode, NamedNodeTableSpecification } from "./NamedNode";
import { NodeTableSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { NodeListProperty } from "./properties/NodeListProperty";
import { NodeListPropertySpecification } from "./properties/NodeListPropertySpecification";

/**
 * the specification of the table which contains the roles
 */
export const RoleTableSpecification: NodeTableSpecification<Role>
    = new NodeTableSpecification<Role>("role", NamedNodeTableSpecification);

/**
 * A Role consists of a selection of permissions, granted to a selection of CCIMSUsers
 */
export class Role extends NamedNode<Role> {

    /**
     * property with all permissions
     */
    public readonly permissionsProperty: NodeListProperty<BasePermission, Role>;

    /**
     * specification for permissionsProperty
     */
    private static readonly permissionsPropertySpecification: NodeListPropertySpecification<BasePermission, Role>
        = NodeListPropertySpecification.loadDynamic<BasePermission, Role>(
            LoadRelationCommand.fromManySide("base_permission", "authorizable_id"),
            (ids, node) => {
                const command = new LoadPermissionsCommand();
                command.ids = ids;
                return command;
            },
            node => {
                const command = new LoadPermissionsCommand();
                command.authorizables = [node.id];
                return command;
            }
        )
        .notifyChanged((permission, node) => permission.authorizableProperty)
        .noSave();
    
    /**
     * creates a new Component instance
     * note: this does NOT create a actually new component, for this @see Component.create
     * @param databaseManager the databaseManager
     * @param id the id
     * @param name the name of the component
     * @param description the description of the component
     */
    public constructor(databaseManager: DatabaseManager, id: string, name: string, description: string) {
        super(NodeType.Component, databaseManager, RoleTableSpecification, id, name, description);

        this.permissionsProperty = new NodeListProperty<BasePermission, Role>(databaseManager, Role.permissionsPropertySpecification, this);
    }

}