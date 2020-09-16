import { LoadRelationCommand } from "../database/commands/load/LoadRelationCommand";
import { LoadComponentsCommand } from "../database/commands/load/nodes/LoadComponentsCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { Component } from "./Component";
import { NamedOwnedNode, NamedOwnedNodeTableSpecification } from "./NamedOwnedNode";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { NodeListProperty } from "./properties/NodeListProperty";
import { NodeListPropertySpecification } from "./properties/NodeListPropertySpecification";
import { User } from "./User";

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
     * creates a new Component instance
     * note: this does NOT create a actually new component, for this @see Project.create
     * @param databaseManager the databaseManager
     * @param id the id
     * @param name the name of the component
     * @param description the description of the component
     * @param ownerId the id of the owner of the component
     */
    public constructor (databaseManager: DatabaseManager, id: string, name: string, description: string, ownerId: string) {
        super(NodeType.Project, databaseManager, ProjectTableSpecification, id, name, description, ownerId);
        this.componentsProperty = this.registerSaveable(new NodeListProperty<Component, Project>(databaseManager, Project.componentsPropertySpecification, this));
    }

    /**
     * creates a new project with the specified name, description, owner and a new id
     * @param name the name of the project, must be shorter than 257 chars
     * @param description the description of the project, must be shorter than 65537 chars
     * @param owner the owner of the project
     */
    public static create(databaseManager: DatabaseManager, name: string, description: string, owner: User): Project {
        if (name.length > 256) {
            throw new Error("the specified name is too long");
        }
        if (description.length > 65536) {
            throw new Error("the specified description is too long");
        }

        const project = new Project(databaseManager, databaseManager.idGenerator.generateString(), name, description, owner.id);
        project.markNew();
        databaseManager.addCachedNode(project);
        return project;
    }
}