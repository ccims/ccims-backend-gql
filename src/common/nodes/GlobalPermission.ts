import { DatabaseManager } from "../database/DatabaseManager";
import { BasePermission, BasePermissionTableSpecification } from "./BasePermission";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";

/**
 * table specification for GlobalPermission
 */
export const GlobalPermissionTableSpecification: NodeTableSpecification<GlobalPermission>
    = new NodeTableSpecification<GlobalPermission>("global_permission", BasePermissionTableSpecification,
        RowSpecification.fromProperty("global_admin", "globalAdmin"),
        RowSpecification.fromProperty("create_delete_projects", "createDeleteProjects"),
        RowSpecification.fromProperty("create_delete_components", "createDeleteComponents"));

/**
 * Global Permission: a permission that is not bound to a component or project
 */
export class GlobalPermission extends BasePermission<GlobalPermission> {
    /**
     * `true` iff a user is allowed to create and delete projects
     */
    public _createDeleteProjects: boolean = false;

    /**
     * `true`, iff a user is allowed to create and delete a component
     */
    public _createDeleteComponents: boolean = false;

    /**
     * `true` iff the user is a global admin (ALL Permissions; use this VERY carefully)
     */
    public _globalAdmin: boolean = false;


    /**
     * Creates a new GlobalPermissions object
     */
    public constructor(databaseManager: DatabaseManager, id: string, authorizableId: string,
        createDeleteProjects: boolean, createDeleteComponents: boolean, globalAdmin: boolean) {
        super(NodeType.GlobalPermission, databaseManager, GlobalPermissionTableSpecification, id, authorizableId);

        this._createDeleteProjects = createDeleteProjects;
        this._createDeleteComponents = createDeleteComponents;
        this._globalAdmin = globalAdmin;
    }


    public get createDeleteProjects(): boolean {
        return this._createDeleteProjects
    }

    public set createDeleteProjects(value: boolean) {
        this.markChanged();
        this._createDeleteProjects = value;
    }

    public get createDeleteComponents(): boolean {
        return this._createDeleteComponents
    }

    public set createDeleteComponents(value: boolean) {
        this.markChanged();
        this._createDeleteComponents = value;
    }

    public get globalAdmin(): boolean {
        return this._globalAdmin
    }

    public set globalAdmin(value: boolean) {
        this.markChanged();
        this._globalAdmin = value;
    }

}