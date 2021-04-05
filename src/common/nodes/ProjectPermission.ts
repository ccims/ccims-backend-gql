import { GetWithReloadCommand } from "../database/commands/GetWithReloadCommand";
import { LoadProjectsCommand } from "../database/commands/load/nodes/LoadProjectsCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { BasePermission, BasePermissionTableSpecification } from "./BasePermission";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { Project } from "./Project";
import { NodePropertySpecification } from "./properties/NodePropertySpecification";
import { NullableNodeProperty } from "./properties/NullableNodeProperty";

/**
 * table specification for ProjectPermission
 */
export const ProjectPermissionTableSpecification: NodeTableSpecification<ProjectPermission>
    = new NodeTableSpecification<ProjectPermission>("project_permission", BasePermissionTableSpecification,
        RowSpecification.fromProperty("add_remove_components", "addRemoveComponents"),
        RowSpecification.fromProperty("project_admin", "projectAdmin"),
        RowSpecification.fromProperty("read_project", "readProject"),
        new RowSpecification("project_id", permission => permission.projectProperty.getId()));

/**
 * Project Permission: a permission that is bound to a specific project
 */
export class ProjectPermission extends BasePermission<ProjectPermission> {

    /**
     * `true` iff a user can add components to ar remove them from the current project
     */
    private _addRemoveComponents: boolean = false;

    /**
     * `true` iff the user is administrator on this project:
     * Add participant users, manage project permissions, delete project, change project data
     */
    private _projectAdmin: boolean = false;

    /**
     * `true`if a user can read this project
     * this also grants read permissions for all components on this project
     * this does not grant any write permissions
     */
    private _readProject: boolean = false;

    /**
     * property for the project for which this permissions grants rights
     */
    public readonly projectProperty: NullableNodeProperty<Project, ProjectPermission>;

    /**
     * specification for projectProperty
     */
    private static readonly projectPropertySpecification: NodePropertySpecification<Project, ProjectPermission>
        = new NodePropertySpecification<Project, ProjectPermission>(
            (id, node) => {
                const command = new LoadProjectsCommand();
                command.ids = [id];
                return command;
            },
            node => new GetWithReloadCommand(node, "project_id", new LoadProjectsCommand()),
            (project, node) => project.permissionsProperty
        );

    /**
     * Creates a new ProjectsPermission
     */
    public constructor(databaseManager: DatabaseManager, id: string, authorizeableId: string, projectId: string,
        addRemoveComponents: boolean, projectAdmin: boolean, readProject: boolean) {
        super(NodeType.ProjectPermission, databaseManager, ProjectPermissionTableSpecification, id, authorizeableId);

        this._addRemoveComponents = addRemoveComponents;
        this._projectAdmin = projectAdmin;
        this._readProject = readProject;
        this.projectProperty = new NullableNodeProperty<Project, ProjectPermission>(databaseManager, ProjectPermission.projectPropertySpecification, this, projectId);
    }
    
    
    public get addRemoveComponents(): boolean {
        return this._addRemoveComponents;
    }

    public set addRemoveComponents(value: boolean) {
        this.markChanged();
        this._addRemoveComponents = value;
    }

    public get projectAdmin(): boolean {
        return this._projectAdmin;
    }

    public set projectAdmin(value: boolean) {
        this.markChanged();
        this._projectAdmin = value;
    }

    public get readProject(): boolean {
        return this._readProject;
    }

    public set readProject(value: boolean) {
        this.markChanged();
        this._readProject = value;
    }
}