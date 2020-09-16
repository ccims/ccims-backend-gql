import { GetWithReloadCommand } from "../database/commands/GetWithReloadCommand";
import { LoadRelationCommand } from "../database/commands/load/LoadRelationCommand";
import { LoadImsSystemsCommand } from "../database/commands/load/nodes/LoadImsSystemsCommand";
import { LoadProjectsCommand } from "../database/commands/load/nodes/LoadProjectsCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { ImsSystem } from "./ImsSystem";
import { Issue } from "./Issue";
import { IssueLocation, issuesOnLocationPropertyDescription } from "./IssueLocation";
import { NamedOwnedNode, NamedOwnedNodeTableSpecification } from "./NamedOwnedNode";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { Project } from "./Project";
import { NodeListProperty } from "./properties/NodeListProperty";
import { NodeListPropertySpecification } from "./properties/NodeListPropertySpecification";
import { NodeProperty } from "./properties/NodeProperty";
import { NodePropertySpecification } from "./properties/NodePropertySpecification";
import { User } from "./User";

export const ComponentTableSpecification: NodeTableSpecification<Component>
    = new NodeTableSpecification<Component>("component", NamedOwnedNodeTableSpecification,
    new RowSpecification("imsSystem_id", component => component.imsSystemProperty.getId()));

export class Component extends NamedOwnedNode implements IssueLocation {

    public readonly issuesOnLocationProperty: NodeListProperty<Issue, IssueLocation>;

    public readonly projectsProperty: NodeListProperty<Project, Component>;

    private static readonly projectsPropertySpecification: NodeListPropertySpecification<Project, Component> 
        = NodeListPropertySpecification.loadDynamic<Project, Component>(LoadRelationCommand.fromSecundary("project", "component"),
            (ids, component) => { 
                const command = new LoadProjectsCommand();
                command.ids = ids;
                return command;
            }, 
            component => {
                const command = new LoadProjectsCommand();
                command.onComponents = [component.id];
                return command;
            })
        .notifyChanged((project, component) => project.componentsProperty)
        .noSave();

    public readonly imsSystemProperty: NodeProperty<ImsSystem, Component>;

    private static readonly imsSystemPropertySpecification: NodePropertySpecification<ImsSystem, Component>
        = new NodePropertySpecification<ImsSystem, Component>(
            (id, component) => {
                const command  = undefined as any;
                command.ids = [id];
                return command;
            },
            component => {
                return new GetWithReloadCommand(component, "imsSystem_id", new LoadImsSystemsCommand());
            },
            (imsSystem, component) => imsSystem.componentProperty
        );

    /**
     * property with all issues
     * do NOT add an issue via this property
     */
    public readonly issuesProperty: NodeListProperty<Issue, Component>;

    private static readonly issuesPropertySpecification: NodeListPropertySpecification<Issue, Component>
        = NodeListPropertySpecification.loadDynamic<Issue, Component>(LoadRelationCommand.fromPrimary("component", "issue"),
            (ids, component) => {
                const command = undefined as any;
                command.ids = ids;
                return command;
            },
            component => {
                const command = undefined as any;
                command.onComponents = [component.id];
                return command;
            })
        //TODO: notifychanged
        .saveOnPrimary("component", "issue");

    public constructor (databaseManager: DatabaseManager, id: string, name: string, description: string, ownerId: string, imsSystemId: string) {
        super(NodeType.Component, databaseManager, ComponentTableSpecification, id, name, description, ownerId);
        this.projectsProperty = this.registerSaveable(new NodeListProperty<Project, Component>(databaseManager, Component.projectsPropertySpecification, this));
        this.imsSystemProperty = this.registerSaveable(new NodeProperty<ImsSystem, Component>(databaseManager, Component.imsSystemPropertySpecification, this, imsSystemId));
        this.issuesOnLocationProperty = this.registerSaveable(new NodeListProperty<Issue, IssueLocation>(databaseManager, issuesOnLocationPropertyDescription, this));
        this.issuesProperty = this.registerSaveable(new NodeListProperty<Issue, Component>(databaseManager, Component.issuesPropertySpecification, this));
    }

    /**
     * creates a new component with the specified name, description, owner and a new id
     * @param name the name of the component, must be shorter than 257 chars
     * @param description the description of the component, must be shorter than 65537 chars
     * @param owner the owner of the component
     */
    public static create(databaseManager: DatabaseManager, name: string, description: string, owner: User, imsSystem: ImsSystem): Component {
        if (name.length > 256) {
            throw new Error("the specified name is too long");
        }
        if (description.length > 65536) {
            throw new Error("the specified description is too long");
        }

        const component = new Component(databaseManager, databaseManager.idGenerator.generateString(), name, description, owner.id, imsSystem.id);
        component.markNew();
        databaseManager.addCachedNode(component);
        return component;
    }
}