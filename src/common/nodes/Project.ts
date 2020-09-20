import { QueryConfig, QueryResult } from "pg";
import { LoadRelationCommand } from "../database/commands/load/LoadRelationCommand";
import { LoadComponentsCommand } from "../database/commands/load/nodes/LoadComponentsCommand";
import { LoadIssuesCommand } from "../database/commands/load/nodes/LoadIssuesCommand";
import { LoadUsersCommand } from "../database/commands/load/nodes/LoadUsersCommand";
import { DatabaseCommand } from "../database/DatabaseCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { Component } from "./Component";
import { Issue } from "./Issue";
import { NamedOwnedNode, NamedOwnedNodeTableSpecification } from "./NamedOwnedNode";
import { NodeTableSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { NodeListProperty } from "./properties/NodeListProperty";
import { NodeListPropertySpecification } from "./properties/NodeListPropertySpecification";
import { User } from "./User";
import { Label } from "./Label";
import { LoadLabelsCommand } from "../database/commands/load/nodes/LoadLabelsCommand";

/**
 * the specification of the table which contains projects
 */
export const ProjectTableSpecification: NodeTableSpecification<Project>
    = new NodeTableSpecification<Project>("project", NamedOwnedNodeTableSpecification);


/**
 * A project
 */
export class Project extends NamedOwnedNode<Project> {

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
                const command = new LoadComponentsCommand();
                command.ids = ids;
                return command;
            },
            project => {
                const command = new LoadComponentsCommand();
                command.onProjects = [project.id];
                return command;
            })
            .notifyChanged((component, project) => component.projectsProperty)
            .saveOnPrimary("project", "component");

    /**
     * Property with the usersparticipating in this project
     */
    public readonly usersProperty: NodeListProperty<User, Project>;

    /**
     * the specification of compopnentsProperty
     */
    private static readonly usersPropertySpecification: NodeListPropertySpecification<User, Project>
        = NodeListPropertySpecification.loadDynamic<User, Project>(LoadRelationCommand.fromSecundary("user", "project"),
            (ids, project) => {
                const command = new LoadUsersCommand();
                command.ids = ids;
                return command;
            },
            project => {
                const command = new LoadUsersCommand();
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
                const command = new LoadIssuesCommand();
                command.ids = ids;
                return command;
            },
            project => {
                const command = new LoadIssuesCommand();
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
                const command = new LoadLabelsCommand();
                command.ids = ids;
                return command
            },
            (project) => {
                const command = new LoadLabelsCommand();
                command.onProjects = [project.id];
                return command;
            }
        )
            .notifyChanged((label, project) => label.projectsProperty)
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
        super(NodeType.Project, databaseManager, ProjectTableSpecification, id, name, description, ownerId);
        this.componentsProperty = new NodeListProperty<Component, Project>(databaseManager, Project.componentsPropertySpecification, this);
        this.issuesProperty = new NodeListProperty<Issue, Project>(databaseManager, Project.issuesPropertySpecification, this);
        this.usersProperty = new NodeListProperty<User, Project>(databaseManager, Project.usersPropertySpecification, this);
        this.labelsProperty = new NodeListProperty<Label, Project>(databaseManager, Project.labelsPropertySpecification, this);
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
        await owner.ownedNodesProperty.add(project);
        await project.usersProperty.add(owner);
        return project;
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
    public getQueryConfig(): QueryConfig<any[]> {
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
    public getQueryConfig(): QueryConfig<any[]> {
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