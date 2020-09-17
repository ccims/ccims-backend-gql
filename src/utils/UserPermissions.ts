import { User } from "../common/nodes/User";

/**
 * Class representing the permissions a user has in the CCIMS
 * 
 * There are project and component specific permissions as well as global permissions
 */
export class UserPermissions {

    /**
     * System wide, global permission of the user
     */
    private _globalPermissions: GlobalPermissions;

    /**
     * Map containing the project specific permissions of a user indexed by project id
     */
    private readonly _projectPermissions: Map<string, ProjectPermission>;

    /**
     * Map containing the component specific permissions of a user indexed by component id
     */
    private readonly _componentPermissions: Map<string, ComponentPermission>;

    /**
     * The user these permisons are for. The obect to notify when updating the permissions
     * For technical reasons this can be undefined during construction.
     * As long as it is, the permissions can't be modified
     */
    private _user: User | undefined;

    /**
     * Initialized permissions based on saved/given permissions or creates a new set of default permissions
     * 
     * @param jsonPermissions The permissions object as it is stored within the database either as parsed object or as string.
     * If this is `undefined`, a new set of default permissions (nothing allowed) will be constructed.
     * @param user The user to notify once these permissions are changed.
     * This can be `undefined`. If it is, the permissions won't be changable until a user is set
     */
    public constructor(jsonPermissions?: DatabsePermissions | string, user?: User) {
        let parsedPermissions: DatabsePermissions = jsonPermissions as DatabsePermissions;
        if (typeof jsonPermissions === "string") {
            parsedPermissions = JSON.parse(jsonPermissions);
        }
        if (user) {
            this._user = user;
        }
        if (typeof parsedPermissions !== "object") {
            this._globalPermissions = new GlobalPermissions();
            this._projectPermissions = new Map();
            this._componentPermissions = new Map();
        } else {
            if (typeof parsedPermissions.global !== "object") {
                this._globalPermissions = new GlobalPermissions();
            } else {
                this._globalPermissions = parsedPermissions.global;
            }
            if (typeof parsedPermissions.project !== "object") {
                this._projectPermissions = new Map();
            } else {
                this._projectPermissions = new Map(parsedPermissions.project);
            }
            if (typeof parsedPermissions.component !== "object") {
                this._componentPermissions = new Map();
            } else {
                this._componentPermissions = new Map(parsedPermissions.component);
            }
        }
    }

    /**
     * NOT TO BE USED OTHER THAN BY A USER OBJECT!!
     * 
     * Sets the user these permissions notify when they are changed
     */
    set user(user: User) {
        if (!this._user) {
            this._user = user;
        }
    }

    /**
     * Sets the permissions of this user on the specified project and notifies the user object
     * 
     * If no user was set yet, this will fail
     * @param projectId The ID of the project fo which to set the permissions
     * @param permissions The new Project permissions to be set
     */
    public setProjectPermissions(projectId: string, permissions: ProjectPermission) {
        if (!this._user) {
            throw new Error("These permissons aren't assigned to any user!");
        }
        this._projectPermissions.set(projectId, permissions);
        this._user.markChanged();
    }

    /**
     * Unsets the permissions for the user on the given project
     * Logically equivalent to setting all permissions for that project to `false` but more efficient
     * 
     * If no user was set yet, this will fail
     * @param projectId The ID of the project on which to unset all the permissions of the user
     */
    public removeProjectPermissions(projectId: string) {
        if (!this._user) {
            throw new Error("These permissons aren't assigned to any user!");
        }
        this._projectPermissions.delete(projectId);
        this._user.markChanged();
    }

    /**
     * Returns the project specific permissions for this user on the given projct
     * 
     * @param projectId The ID of the project of which to get the users permission
     * @returns An object containing the project specific permissions.
     * Modifications to this object won't be stored. Use `setProjectPermissions` for changing
     */
    public getProjectPermissions(projectId: string): ProjectPermission {
        return this._projectPermissions.get(projectId) ?? new ProjectPermission();
    }

    /**
     * Sets the permissions of this user on the specified component and notifies the user object
     * 
     * If no user was set yet, this will fail
     * @param componentId The ID of the component fo which to set the permissions
     * @param permissions The new Component permissions to be set
     */
    public setComponentPermissions(componentId: string, permissions: ComponentPermission) {
        if (!this._user) {
            throw new Error("These permissons aren't assigned to any user!");
        }
        this._componentPermissions.set(componentId, permissions);
        this._user.markChanged();
    }

    /**
     * Unsets the permissions for the user on the given component
     * Logically equivalent to setting all permissions for that component to `false` but more efficient
     * 
     * If no user was set yet, this will fail
     * @param componentId The ID of the component on which to unset all the permissions of the user
     */
    public removeComponentPermissions(componentId: string) {
        if (!this._user) {
            throw new Error("These permissons aren't assigned to any user!");
        }
        this._componentPermissions.delete(componentId);
        this._user.markChanged();
    }

    /**
     * Returns the component specific permissions for this user on the given component
     * 
     * @param componentId The ID of the component of which to get the users permission
     * @returns An object containing the component specific permissions.
     * Modifications to this object won't be stored. Use `setComponentPermissions` for changing
     */
    public getComponentPermissions(componentId: string): ComponentPermission {
        return this._componentPermissions.get(componentId) ?? new ComponentPermission();
    }

    public set globalPermissions(permissions: GlobalPermissions) {
        if (!this._user) {
            throw new Error("These permissons aren't assigned to any user!");
        }
        this._globalPermissions = permissions;
        this._user.markChanged();
    }

    /**
     * Returns the global permissions for this user
     * 
     * @returns An object containing the global permissions.
     * Modifications to this object won't be stored. Set a new `GlobalPermissions` to change them
     */
    public get globalPermissions(): GlobalPermissions {
        return this._globalPermissions;
    }

    /**
     * Converts this database object to a JS-object which is serializable to JSON and savable in the database
     * 
     * @returns An object implementing `DatabasePermission` which is a serializable representation of this object
     */
    public toDatabase(): DatabsePermissions {
        return { global: this._globalPermissions, project: [...this._projectPermissions], component: [...this._componentPermissions] };
    }
}

/**
 * An interface specifying the structure of the permissions when saved to the database
 */
interface DatabsePermissions {
    global: GlobalPermissions,
    project: Array<[string, ProjectPermission]>,
    component: Array<[string, ComponentPermission]>
}


/**
 * Project specific permissions of a user
 */
class ProjectPermission {
    public constructor(
        /**
         * `true` iff a user can add components to ar remove them from the current project
         */
        public readonly addRemoveComponents: boolean = false,

        /**
         * `true` iff a user can link issues within this project
         */
        public readonly linkIssues: boolean = false,

        /**
         * `true` iff the user is administrator on this project:
         * Add participant users, manage project permissions, delete project, change project data
         */
        public readonly projectAdmin: boolean = false
    ) {

    }
}

class ComponentPermission {
    public constructor(
        /**
         * `true` iff the user is allowed to create/edit/delete his own issues on this component
         */
        public readonly editIssues: boolean = false,

        /**
         * `true` iff the user is allowed to edit/delete other users issues on this component
         */
        public readonly moderate: boolean = false,

        /**
         * `true` iff the user is allowed to change the location of an issue to a location belonging to this component
         * (The component itself or an interfece offered by it)
         */
        public readonly editIssueLocation: boolean = false,

        /**
         * `true` iff a user is an administrator of this component
         * Add users to this component, manage component permissions, mangage interfaces, delete component)
         */
        public readonly componentAdmin: boolean = false,

        /**
         * `true` iff the user is allowed to manage the IMS of this compounent (set api token, url, etc.)
         */
        public readonly changeIMS: boolean = false
    ) {

    }
}

class GlobalPermissions {
    public constructor(
        /**
         * `true` iff a user is allowed to create and delete projects
         */
        public readonly addRemoveProjects: boolean = false,

        /**
         * `true`, iff a user is allowed to create and delete a component
         */
        public readonly addRemoveComponents: boolean = false,

        /**
         * `true` iff the user is a global admin (ALL Permissions; use this VERY carefully)
         */
        public readonly globalAdmin: boolean = false
    ) {

    }
}