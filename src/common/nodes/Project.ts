import { QueryConfig, QueryResult } from "pg";
import { LoadRelationCommand } from "../database/commands/load/LoadRelationCommand";
import { LoadComponentsCommand } from "../database/commands/load/nodes/LoadComponentsCommand";
import { LoadIssuesCommand } from "../database/commands/load/nodes/LoadIssuesCommand";
import { DatabaseCommand } from "../database/DatabaseCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { Component } from "./Component";
import { Issue } from "./Issue";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { NodeListProperty } from "./properties/NodeListProperty";
import { NodeListPropertySpecification } from "./properties/NodeListPropertySpecification";
import { User } from "./User";
import { Label } from "./Label";
import { LoadLabelsCommand } from "../database/commands/load/nodes/LoadLabelsCommand";
import { ComponentInterface } from "./ComponentInterface";
import { LoadComponentInterfacesCommand } from "../database/commands/load/nodes/LoadComponentInterfacesCommand";
import { NamedNode, NamedNodeTableSpecification } from "./NamedNode";
import { GetWithReloadCommand } from "../database/commands/GetWithReloadCommand";
import { NodePropertySpecification } from "./properties/NodePropertySpecification";
import { NullableNodeProperty } from "./properties/NullableNodeProperty";
import { LoadUsersCommand } from "../database/commands/load/nodes/LoadUsersCommand";
import { LoadProjectPermissionsCommand } from "../database/commands/load/nodes/LoadProjectPermissionsCommand";
import { ProjectPermission } from "./ProjectPermission";

/**
 * the specification of the table which contains projects
 */
export const ProjectTableSpecification: NodeTableSpecification<Project>
    = new NodeTableSpecification<Project>("project", NamedNodeTableSpecification,
        new RowSpecification("owner_user_id", component => component.ownerProperty.getId()));


/**
 * A project
 */
export class Project extends NamedNode<Project> {

    /**
     * the owner property which contains the owner of this node
     */
    public readonly ownerProperty: NullableNodeProperty<User, Project>;

    /**
     * specification of the ownerProperty
     */
    private static readonly ownerPropertySpecification: NodePropertySpecification<User, Project>
        = new NodePropertySpecification<User, Project>(
            (id, node) => {
                const command = new LoadUsersCommand();
                command.ids = [id];
                return command;
            },
            node => new GetWithReloadCommand(node, "owner_user_id", new LoadUsersCommand()),
            (user, node) => user.ownedProjectsProperty
        );

    /**
     * Async getter funtion for the ownerProperty
     * @returns A promise of the user owning this node
     */
    public async owner(): Promise<User | undefined> {
        return this.ownerProperty.getPublic();
    }

    /**
     * property with the components on this project
     */
    public readonly componentsProperty: NodeListProperty<Component, Project>;

    /**
     * the specification of compopnentsProperty
     */
    private static readonly componentsPropertySpecification: NodeListPropertySpecification<Component, Project>
        = NodeListPropertySpecification.loadDynamic<Component, Project>(LoadRelationCommand.fromPrimary("project", "component"),
            (ids, project) => {
                const command = new LoadComponentsCommand(true);
                command.ids = ids;
                return command;
            },
            project => {
                const command = new LoadComponentsCommand(true);
                command.onProjects = [project.id];
                return command;
            })
            .notifyChanged((component, project) => component.projectsProperty)
            .saveOnPrimary("project", "component");

    /**
     * property with all issues
     * do NOT add an issue via this property
     * do NOT remove an issue via this property
     */
    public readonly issuesProperty: NodeListProperty<Issue, Project>;

    /**
     * specification of the issuesProperty
     */
    private static readonly issuesPropertySpecification: NodeListPropertySpecification<Issue, Project>
        = NodeListPropertySpecification.loadDynamic<Issue, Project>(
            project => new LoadIssueIdsCommand(project.id),
            (ids, project) => {
                const command = new LoadIssuesCommand(true);
                command.ids = ids;
                return command;
            },
            project => {
                const command = new LoadIssuesCommand(true);
                command.onProjects = [project.id];
                return command;
            })
            .noSave();

    /**
     * property with all interfaces
     * do NOT add an interfaces via this property
     * do NOT remove an interface via this property
     */
    public readonly interfacesProperty: NodeListProperty<ComponentInterface, Project>;

    /**
     * specification of the interfacesProperty
     */
    private static readonly interfacesPropertySpecification: NodeListPropertySpecification<ComponentInterface, Project>
        = NodeListPropertySpecification.loadDynamic<ComponentInterface, Project>(
            project => new LoadComponentInterfacesIdsCommand(project.id),
            (ids, project) => {
                const command = new LoadComponentInterfacesCommand(true);
                command.ids = ids;
                return command;
            },
            project => {
                const command = new LoadComponentInterfacesCommand(true);
                command.onProjects = [project.id];
                return command;
            })
            .noSave();

    /**
     * Property of all labels that are available on this project (all labels on all components on this project)
     * IT IS __NOT__ POSSIBLE TO ADD A LABEL TO A PROJECT VIA THIS PROPERTY
     */
    public readonly labelsProperty: NodeListProperty<Label, Project>;

    /**
     * Specification for the labelsProperty loading all ids of labels and the corresponding labels
     */
    private static readonly labelsPropertySpecification: NodeListPropertySpecification<Label, Project> =
        NodeListPropertySpecification.loadDynamic<Label, Project>(
            project => new LoadLabelsIdsCommand(project.id),
            (ids, project) => {
                const command = new LoadLabelsCommand(true);
                command.ids = ids;
                return command
            },
            (project) => {
                const command = new LoadLabelsCommand(true);
                command.onProjects = [project.id];
                return command;
            }
        )
            .notifyChanged((label, project) => label.projectsProperty)
            .noSave();

    
    /**
     * property with all permissions which affect this project
     */
    public readonly permissionsProperty: NodeListProperty<ProjectPermission, Project>;

    /**
     * specification for permissionsProperty
     */
    private static readonly permissionsPropertySpecification: NodeListPropertySpecification<ProjectPermission, Project>
        = NodeListPropertySpecification.loadDynamic<ProjectPermission, Project>(
            LoadRelationCommand.fromManySide("project_permission", "project_id"),
            (ids, node) => {
                const command = new LoadProjectPermissionsCommand();
                command.ids = ids;
                return command;
            },
            node => {
                const command = new LoadProjectPermissionsCommand();
                command.projects = [node.id];
                return command;
            }
        )
        .notifyChanged((permission, node) => permission.projectProperty)
        .noSave();


    /**
     * creates a new Component instance
     * note: this does NOT create a actually new component, for this @see Project.create
     * @param databaseManager the databaseManager
     * @param id the id
     * @param name the name of the component
     * @param description the description of the component
     * @param ownerId the id of the owner of the component
     */
    public constructor(databaseManager: DatabaseManager, id: string, name: string, description: string, ownerId: string) {
        super(NodeType.Project, databaseManager, ProjectTableSpecification, id, name, description);
        this.ownerProperty = new NullableNodeProperty<User, Project>(databaseManager, Project.ownerPropertySpecification, this, ownerId);
        this.componentsProperty = new NodeListProperty<Component, Project>(databaseManager, Project.componentsPropertySpecification, this);
        this.interfacesProperty = new NodeListProperty<ComponentInterface, Project>(databaseManager, Project.interfacesPropertySpecification, this);
        this.issuesProperty = new NodeListProperty<Issue, Project>(databaseManager, Project.issuesPropertySpecification, this);
        this.labelsProperty = new NodeListProperty<Label, Project>(databaseManager, Project.labelsPropertySpecification, this);
        this.permissionsProperty = new NodeListProperty<ProjectPermission, Project>(databaseManager, Project.permissionsPropertySpecification, this);
    }

    /**
     * creates a new project with the specified name, description, owner and a new id
     * @param name the name of the project, must be shorter than 257 chars
     * @param description the description of the project, must be shorter than 65537 chars
     * @param owner the owner of the project
     */
    public static async create(databaseManager: DatabaseManager, name: string, description: string, owner: User): Promise<Project> {
        if (name.length > 256) {
            throw new Error("The specified name is too long");
        }
        if (description.length > 65536) {
            throw new Error("The specified description is too long");
        }

        const project = new Project(databaseManager, databaseManager.idGenerator.generateString(), name, description, owner.id);
        project.markNew();
        databaseManager.addCachedNode(project);
        await owner.ownedProjectsProperty.add(project);
        return project;
    }

    /**
     * marks this node as deleted
     * this also marks this node as changed
     */
    public async markDeleted(): Promise<void> {
        if (!this.isDeleted) {
            await super.markDeleted();
            await this.ownerProperty.markDeleted();
            await this.componentsProperty.clear();
            await this.issuesProperty.clear();
            await this.labelsProperty.clear();
            await this.interfacesProperty.clear();
            await this.permissionsProperty.clear();
        }
    }
}

/**
 * command to laod all ids of issues on a project
 */
class LoadIssueIdsCommand extends DatabaseCommand<string[]> {

    /**
     * creates a new LoadIssueIdsCommand
     * @param projectId the id of the project
     */
    public constructor(private readonly projectId: string) {
        super();
    }

    /**
     * generates the query config
     */
    public getQueryConfig(databaseManager: DatabaseManager): QueryConfig<any[]> {
        return {
            text: "SELECT DISTINCT ON(issue_id) issue_id FROM relation_component_issue WHERE component_id=ANY(SELECT component_id FROM relation_project_component WHERE project_id=$1);",
            values: [this.projectId]
        }
    }

    /**
     * called when the query is finished
     * @param databaseManager the databaseManager
     * @param result the query result
     */
    public setDatabaseResult(databaseManager: DatabaseManager, result: QueryResult<any>): DatabaseCommand<any>[] {
        this.result = result.rows.map(row => row.issue_id);
        return [];
    }

}

/**
 * command to laod all ids of labels on a project
 */
class LoadLabelsIdsCommand extends DatabaseCommand<string[]> {

    /**
     * creates a new LoadLabelsIdsCommand
     * @param projectId the id of the project
     */
    public constructor(private readonly projectId: string) {
        super();
    }

    /**
     * generates the query config
     */
    public getQueryConfig(databaseManager: DatabaseManager): QueryConfig<any[]> {
        return {
            text: "SELECT DISTINCT ON(label_id) label_id FROM relation_component_label WHERE component_id=ANY(SELECT component_id FROM relation_project_component WHERE project_id=$1);",
            values: [this.projectId]
        }
    }

    /**
     * called when the query is finished
     * @param databaseManager the databaseManager
     * @param result the query result
     */
    public setDatabaseResult(databaseManager: DatabaseManager, result: QueryResult<any>): DatabaseCommand<any>[] {
        this.result = result.rows.map(row => row.label_id);
        return [];
    }

}

/**
 * command to laod all ids of interfaces on a project
 */
class LoadComponentInterfacesIdsCommand extends DatabaseCommand<string[]> {

    /**
     * creates a new LoadComponentInterfacesIdsCommand
     * @param projectId the id of the project
     */
    public constructor(private readonly projectId: string) {
        super();
    }

    /**
     * generates the query config
     */
    public getQueryConfig(databaseManager: DatabaseManager): QueryConfig<any[]> {
        return {
            text: "SELECT id FROM component_interface WHERE host_component_id=ANY(SELECT component_id FROM relation_project_component WHERE project_id=$1);",
            values: [this.projectId]
        }
    }

    /**
     * called when the query is finished
     * @param databaseManager the databaseManager
     * @param result the query result
     */
    public setDatabaseResult(databaseManager: DatabaseManager, result: QueryResult<any>): DatabaseCommand<any>[] {
        this.result = result.rows.map(row => row.id);
        return [];
    }

}