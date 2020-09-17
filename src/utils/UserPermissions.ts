import { User } from "../common/nodes/User";

export class UserPermissions {
    private _globalPermissions: GlobalPermissions;
    private readonly _projectPermissions: Map<string, ProjectPermission>;
    private readonly _componentPermissions: Map<string, ComponentPermission>;
    private _user: User;

    public constructor(user: User, jsonPermissions: DatabsePermissions) {
        this._user = user;
        if (typeof jsonPermissions !== "object") {
            this._globalPermissions = new GlobalPermissions();
            this._projectPermissions = new Map();
            this._componentPermissions = new Map();
        } else {
            if (typeof jsonPermissions.global !== "object") {
                this._globalPermissions = new GlobalPermissions();
            } else {
                this._globalPermissions = jsonPermissions.global;
            }
            if (typeof jsonPermissions.project !== "object") {
                this._projectPermissions = new Map();
            } else {
                this._projectPermissions = new Map(jsonPermissions.project);
            }
            if (typeof jsonPermissions.component !== "object") {
                this._componentPermissions = new Map();
            } else {
                this._componentPermissions = new Map(jsonPermissions.component);
            }
        }
    }

    public setProjectPermissions(projectId: string, permissions: ProjectPermission) {
        this._projectPermissions.set(projectId, permissions);
        this._user.markChanged();
    }

    public removeProjectPermissions(projectId: string) {
        this._projectPermissions.delete(projectId);
        this._user.markChanged();
    }

    public setComponentPermissions(projectId: string, permissions: ProjectPermission) {
        this._projectPermissions.set(projectId, permissions);
        this._user.markChanged();
    }

    public removeComponentPermissions(projectId: string) {
        this._projectPermissions.delete(projectId);
        this._user.markChanged();
    }

    public set globalPermissions(permissions: GlobalPermissions) {
        this._globalPermissions = permissions;
        this._user.markChanged();
    }

    public get globalPermissions(): GlobalPermissions {
        return this._globalPermissions;
    }

    public toDatabase(): DatabsePermissions {
        return { global: this._globalPermissions, project: [...this._projectPermissions], component: [...this._componentPermissions] };
    }
}

interface DatabsePermissions {
    global: GlobalPermissions,
    project: Array<[string, ProjectPermission]>,
    component: Array<[string, ComponentPermission]>
}

class ProjectPermission {
    public readonly addRemoveComponents: boolean = false;
    public readonly linkIssues: boolean = false;
    public readonly projectAdmin: boolean = false;

    public constructor(jsonPermissions?: string) {

    }
}

class ComponentPermission {
    public readonly editIssues: boolean = false;
    public readonly moderate: boolean = false;
    public readonly editIssueLocation: boolean = false;
    public readonly componentAdmin: boolean = false;
    public readonly changeIMS: boolean = false;

    public constructor(jsonPermissions?: string) {

    }
}

class GlobalPermissions {
    public readonly addRemoveProjects: boolean = false;
    public readonly addRemoveComponents: boolean = false;
    public readonly globalAdmin: boolean = false;

    public constructor(jsonPermissions?: string) {

    }
}