import { GetWithReloadCommand } from "../database/commands/GetWithReloadCommand";
import { LoadRelationCommand } from "../database/commands/load/LoadRelationCommand";
import { LoadImsSystemsCommand } from "../database/commands/load/nodes/LoadImsSystemsCommand";
import { LoadProjectsCommand } from "../database/commands/load/nodes/LoadProjectsCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { ImsSystem } from "./ImsSystem";
import { IssueLocation, IssueLocationTableSpecification } from "./IssueLocation";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { Project } from "./Project";
import { NodeProperty } from "./properties/NodeProperty";
import { NodePropertySpecification } from "./properties/NodePropertySpecification";
import { NodesProperty } from "./properties/NodesProperty";
import { NodesPropertySpecification } from "./properties/NodesPropertySpecification";
import { User } from "./User";

export const ComponentTableSpecification: NodeTableSpecification<Component>
    = new NodeTableSpecification<Component>("component", IssueLocationTableSpecification,
    new RowSpecification("imsSystem_id", component => component.imsSystemProperty.getId()));

export class Component extends IssueLocation {

    public readonly projectsProperty: NodesProperty<Project, Component>;

    private static readonly projectsPropertySpecification: NodesPropertySpecification<Project, Component> 
        = NodesPropertySpecification.loadDynamic<Project, Component>(LoadRelationCommand.fromSecundary("project", "component"),
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

    public constructor (databaseManager: DatabaseManager, id: string, name: string, description: string, ownerId: string, imsSystemId: string) {
        super(NodeType.Component, databaseManager, ComponentTableSpecification, id, name, description, ownerId);
        this.projectsProperty = this.registerSaveable(new NodesProperty<Project, Component>(databaseManager, Component.projectsPropertySpecification, this));
        this.imsSystemProperty = this.registerSaveable(new NodeProperty<ImsSystem, Component>(databaseManager, Component.imsSystemPropertySpecification, this, imsSystemId));
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