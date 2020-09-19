import { GetWithReloadCommand } from "../database/commands/GetWithReloadCommand";
import { LoadRelationCommand } from "../database/commands/load/LoadRelationCommand";
import { LoadComponentInterfacesCommand } from "../database/commands/load/nodes/LoadComponentInterfacesCommand";
import { LoadImsSystemsCommand } from "../database/commands/load/nodes/LoadImsSystemsCommand";
import { LoadIssuesCommand } from "../database/commands/load/nodes/LoadIssuesCommand";
import { LoadProjectsCommand } from "../database/commands/load/nodes/LoadProjectsCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { ComponentInterface } from "./ComponentInterface";
import { ImsSystem } from "./ImsSystem";
import { Issue } from "./Issue";
import { IssueLocation, issuesOnLocationPropertySpecification } from "./IssueLocation";
import { NamedOwnedNode, NamedOwnedNodeTableSpecification } from "./NamedOwnedNode";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { Project } from "./Project";
import { NodeListProperty } from "./properties/NodeListProperty";
import { NodeListPropertySpecification } from "./properties/NodeListPropertySpecification";
import { NodePropertySpecification } from "./properties/NodePropertySpecification";
import { NullableNodeProperty } from "./properties/NullableNodeProperty";
import { User } from "./User";
import { Label } from "./Label";
import { LoadLabelsCommand } from "../database/commands/load/nodes/LoadLabelsCommand";

/**
 * the specification of the table which contains components
 */
export const ComponentTableSpecification: NodeTableSpecification<Component>
    = new NodeTableSpecification<Component>("component", NamedOwnedNodeTableSpecification,
        new RowSpecification("imsSystem_id", component => component.imsSystemProperty.getId()));

/**
 * A component known to ccims.
 * component can have issues and can be assigned to multiple projects. (NOTE: One IMS per component)
 */
export class Component extends NamedOwnedNode implements IssueLocation {

    /**
     * property for issues which are located on this component
     */
    public readonly issuesOnLocationProperty: NodeListProperty<Issue, IssueLocation>;

    /**
     * property for all projects which contain this component
     */
    public readonly projectsProperty: NodeListProperty<Project, Component>;

    /**
     * specification of the projectsProperty
     */
    private static readonly projectsPropertySpecification: NodeListPropertySpecification<Project, Component>
        = NodeListPropertySpecification.loadDynamic<Project, Component>(LoadRelationCommand.fromSecundary("project", "component"),
            (ids, component) => {
                const command = new LoadProjectsCommand();
                command.ids = ids;
                return command;
            },
            component => {
                const command = new LoadProjectsCommand();
                command.components = [component.id];
                return command;
            })
            .notifyChanged((project, component) => project.componentsProperty)
            .noSave();

    /**
     * property for the imsSystem of this component
     */
    public readonly imsSystemProperty: NullableNodeProperty<ImsSystem, Component>;

    /**
     * specification of the imsSystemProperty
     */
    private static readonly imsSystemPropertySpecification: NodePropertySpecification<ImsSystem, Component>
        = new NodePropertySpecification<ImsSystem, Component>(
            (id, component) => {
                const command = new LoadImsSystemsCommand();
                command.ids = [id];
                return command;
            },
            component => {
                return new GetWithReloadCommand(component, "imsSystem_id", new LoadImsSystemsCommand());
            },
            (imsSystem, component) => imsSystem.componentProperty
        );

    /**
     * Async getter function for the ims of this component
     * @returns A promise of a ims that belongs to this component or `undefined`
     */
    public async ims(): Promise<ImsSystem | undefined> {
        return this.imsSystemProperty.get();
    }

    /**
     * property with all issues
     * do NOT add an issue via this property
     */
    public readonly issuesProperty: NodeListProperty<Issue, Component>;

    /**
     * specification of the issuesProperty
     */
    private static readonly issuesPropertySpecification: NodeListPropertySpecification<Issue, Component>
        = NodeListPropertySpecification.loadDynamic<Issue, Component>(LoadRelationCommand.fromPrimary("component", "issue"),
            (ids, component) => {
                const command = new LoadIssuesCommand();
                command.ids = ids;
                return command;
            },
            component => {
                const command = new LoadIssuesCommand();
                command.onComponents = [component.id];
                return command;
            })
            .notifyChanged((issue, component) => issue.componentsProperty)
            .saveOnPrimary("component", "issue");

    /**
     * property with all issues which are pinned on this component
     * do NOT pin an issue via this property
     */
    public readonly pinnedIssuesProperty: NodeListProperty<Issue, Component>;

    /**
     * specification of the pinnedIssuesProperty
     */
    private static readonly pinnedIssuesPropertySpecification: NodeListPropertySpecification<Issue, Component>
        = NodeListPropertySpecification.loadDynamic<Issue, Component>(LoadRelationCommand.fromPrimary("component", "pinnedIssue"),
            (ids, component) => {
                const command = new LoadIssuesCommand();
                command.ids = ids;
                return command;
            },
            component => {
                const command = new LoadIssuesCommand();
                command.onComponents = [component.id];
                return command;
            })
            .notifyChanged((issue, component) => issue.componentsProperty)
            .saveOnPrimary("component", "pinnedIssue");

    /**
     * property with all componentInterfaces of this component
     */
    public readonly interfacesProperty: NodeListProperty<ComponentInterface, Component>;

    private static readonly interfacesPropertySpecification: NodeListPropertySpecification<ComponentInterface, Component>
        = NodeListPropertySpecification.loadDynamic<ComponentInterface, Component>(LoadRelationCommand.fromManySide("component_interface", "host_component_id"),
            (ids, component) => {
                const command = new LoadComponentInterfacesCommand();
                command.ids = ids;
                return command;
            },
            component => {
                const command = new LoadComponentInterfacesCommand();
                command.onComponents = [component.id];
                return command;
            })
            .notifyChanged((componentInterface, component) => componentInterface.componentProperty)
            .noSave();

    /**
     * property with all componentInterfaces of this component
     */
    public readonly consumedInterfacesProperty: NodeListProperty<ComponentInterface, Component>;

    /**
     * specification of consumedInterfacesProperty
     */
    private static readonly consumedInterfacesPropertySpecification: NodeListPropertySpecification<ComponentInterface, Component>
        = NodeListPropertySpecification.loadDynamic<ComponentInterface, Component>(LoadRelationCommand.fromPrimary("component", "consumedComponentInterface"),
            (ids, component) => {
                const command = new LoadComponentInterfacesCommand();
                command.ids = ids;
                return command;
            },
            component => {
                const command = new LoadComponentInterfacesCommand();
                command.consumedByComponent = [component.id];
                return command;
            })
            .notifyChanged((componentInterface, component) => componentInterface.consumedByProperty)
            .saveOnPrimary("component", "consumedComponentInterface");

    /**
     * Property of all labels on thic component
     */
    public readonly labelsProperty: NodeListProperty<Label, Component>;

    /**
     * Specification for the labelsProperty
     */
    private static readonly labelsPropertySpecification: NodeListPropertySpecification<Label, Component> =
        NodeListPropertySpecification.loadDynamic<Label, Component>(LoadRelationCommand.fromPrimary("component", "label"),
            (ids, component) => {
                const command = new LoadLabelsCommand();
                command.ids = ids;
                return command;
            },
            (component) => {
                const command = new LoadLabelsCommand();
                command.onComponents = [component.id];
                return command;
            })
            .notifyChanged((label, component) => label.componentsProperty)
            .saveOnPrimary("component", "label");


    /**
     * creates a new Component instance
     * note: this does NOT create a actually new component, for this @see Component.create
     * @param databaseManager the databaseManager
     * @param id the id
     * @param name the name of the component
     * @param description the description of the component
     * @param ownerId the id of the owner of the component
     * @param imsSystemId the id of the ims of the component
     */
    public constructor(databaseManager: DatabaseManager, id: string, name: string, description: string, ownerId: string, imsSystemId?: string) {
        super(NodeType.Component, databaseManager, ComponentTableSpecification, id, name, description, ownerId);
        this.projectsProperty = new NodeListProperty<Project, Component>(databaseManager, Component.projectsPropertySpecification, this);
        this.imsSystemProperty = new NullableNodeProperty<ImsSystem, Component>(databaseManager, Component.imsSystemPropertySpecification, this, imsSystemId);
        this.issuesOnLocationProperty = new NodeListProperty<Issue, IssueLocation>(databaseManager, issuesOnLocationPropertySpecification, this);
        this.issuesProperty = new NodeListProperty<Issue, Component>(databaseManager, Component.issuesPropertySpecification, this);
        this.interfacesProperty = new NodeListProperty<ComponentInterface, Component>(databaseManager, Component.interfacesPropertySpecification, this);
        this.consumedInterfacesProperty = new NodeListProperty<ComponentInterface, Component>(databaseManager, Component.consumedInterfacesPropertySpecification, this);
        this.pinnedIssuesProperty = new NodeListProperty<Issue, Component>(databaseManager, Component.pinnedIssuesPropertySpecification, this);
        this.labelsProperty = new NodeListProperty<Label, Component>(databaseManager, Component.labelsPropertySpecification, this);
    }

    /**
     * creates a new component with the specified name, description, owner and a new id
     * also creates the imsSystem for the component with imsType, endpoint and connectionData
     * @param databaseManager
     * @param name the name of the component, must be shorter than 257 chars
     * @param description the description of the component, must be shorter than 65537 chars
     * @param owner the owner of the component
     * @param imsType the type of the associated imsSystem
     * @param endpoint the endpoint of the associated imsSystemn
     * @param connectionData the connectionData of the associated imsSystem
     */
    public static async create(databaseManager: DatabaseManager, name: string, description: string, owner: User): Promise<Component> {
        if (name.length > 256) {
            throw new Error("the specified name is too long");
        }
        if (description.length > 65536) {
            throw new Error("the specified description is too long");
        }

        const component = new Component(databaseManager, databaseManager.idGenerator.generateString(), name, description, owner.id);
        component.markNew();
        databaseManager.addCachedNode(component);
        await owner.ownedNodesProperty.add(component);
        return component;
    }
}