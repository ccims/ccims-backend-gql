import { GetWithReloadCommand } from "../database/commands/GetWithReloadCommand";
import { LoadRelationCommand } from "../database/commands/load/LoadRelationCommand";
import { LoadComponentInterfacesCommand } from "../database/commands/load/nodes/LoadComponentInterfacesCommand";
import { LoadIMSSystemsCommand } from "../database/commands/load/nodes/LoadIMSSystemsCommand";
import { LoadIssuesCommand } from "../database/commands/load/nodes/LoadIssuesCommand";
import { LoadProjectsCommand } from "../database/commands/load/nodes/LoadProjectsCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { ComponentInterface } from "./ComponentInterface";
import { IMSSystem } from "./IMSSystem";
import { Issue } from "./Issue";
import { IssueLocation, issuesOnLocationPropertySpecification } from "./IssueLocation";
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
import { log } from "../../log";
import { LoadUsersCommand } from "../database/commands/load/nodes/LoadUsersCommand";
import { NamedSyncNode, NamedSyncNodeTableSpecification } from "./NamedSyncNode";
import { SyncMetadata } from "./SyncMetadata";

/**
 * the specification of the table which contains components
 */
export const ComponentTableSpecification: NodeTableSpecification<Component>
    = new NodeTableSpecification<Component>("component", NamedSyncNodeTableSpecification,
        new RowSpecification("owner_user_id", component => component.ownerProperty.getId()),
        new RowSpecification("ims_system_id", component => component.imsSystemProperty.getId()));

/**
 * A component known to ccims.
 * component can have issues and can be assigned to multiple projects. (NOTE: One IMS per component)
 */
export class Component extends NamedSyncNode<Component> implements IssueLocation {

    /**
     * the owner property which contains the owner of this node
     */
    public readonly ownerProperty: NullableNodeProperty<User, Component>;

    /**
     * specification of the ownerProperty
     */
    private static readonly ownerPropertySpecification: NodePropertySpecification<User, Component>
        = new NodePropertySpecification<User, Component>(
            (id, node) => {
                const command = new LoadUsersCommand();
                command.ids = [id];
                return command;
            },
            node => new GetWithReloadCommand(node, "owner_user_id", new LoadUsersCommand()),
            (user, node) => user.ownedComponentsProperty
        );

    /**
     * Async getter funtion for the ownerProperty
     * @returns A promise of the user owning this node
     */
    public async owner(): Promise<User | undefined> {
        return this.ownerProperty.getPublic();
    }

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
    public readonly imsSystemProperty: NullableNodeProperty<IMSSystem, Component>;

    /**
     * specification of the imsSystemProperty
     */
    private static readonly imsSystemPropertySpecification: NodePropertySpecification<IMSSystem, Component>
        = new NodePropertySpecification<IMSSystem, Component>(
            (id, component) => {
                const command = new LoadIMSSystemsCommand();
                command.ids = [id];
                return command;
            },
            component => {
                return new GetWithReloadCommand(component, "ims_system_id", new LoadIMSSystemsCommand());
            },
            (imsSystem, component) => imsSystem.componentProperty
        );

    /**
     * Async getter function for the ims of this component
     * @returns A promise of a ims that belongs to this component or `undefined`
     */
    public async ims(): Promise<IMSSystem | undefined> {
        return this.imsSystemProperty.getPublic();
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
                const command = new LoadIssuesCommand(true);
                command.ids = ids;
                return command;
            },
            component => {
                const command = new LoadIssuesCommand(true);
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
        = NodeListPropertySpecification.loadDynamic<Issue, Component>(LoadRelationCommand.fromPrimary("component", "pinned_issue"),
            (ids, component) => {
                const command = new LoadIssuesCommand(true);
                command.ids = ids;
                return command;
            },
            component => {
                const command = new LoadIssuesCommand(true);
                command.onComponents = [component.id];
                return command;
            })
            .notifyChanged((issue, component) => issue.componentsProperty)
            .saveOnPrimary("component", "pinned_issue");

    /**
     * property with all componentInterfaces of this component
     */
    public readonly interfacesProperty: NodeListProperty<ComponentInterface, Component>;

    private static readonly interfacesPropertySpecification: NodeListPropertySpecification<ComponentInterface, Component>
        = NodeListPropertySpecification.loadDynamic<ComponentInterface, Component>(LoadRelationCommand.fromManySide("component_interface", "host_component_id"),
            (ids, component) => {
                const command = new LoadComponentInterfacesCommand(true);
                command.ids = ids;
                return command;
            },
            component => {
                const command = new LoadComponentInterfacesCommand(true);
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
        = NodeListPropertySpecification.loadDynamic<ComponentInterface, Component>(LoadRelationCommand.fromPrimary("component", "consumed_component_interface"),
            (ids, component) => {
                const command = new LoadComponentInterfacesCommand(true);
                command.ids = ids;
                return command;
            },
            component => {
                const command = new LoadComponentInterfacesCommand(true);
                command.consumedByComponent = [component.id];
                return command;
            })
            .notifyChanged((componentInterface, component) => componentInterface.consumedByProperty)
            .saveOnPrimary("component", "consumed_component_interface");

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
                const command = new LoadLabelsCommand(true);
                command.ids = ids;
                return command;
            },
            (component) => {
                const command = new LoadLabelsCommand(true);
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
    public constructor(databaseManager: DatabaseManager, id: string, name: string, description: string, ownerId: string, imsSystemId: string | undefined, createdById: string | undefined, createdAt: Date,
        isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(NodeType.Component, databaseManager, ComponentTableSpecification, id, name, description, createdById, createdAt, isDeleted, lastModifiedAt, metadata);
        this.ownerProperty = new NullableNodeProperty<User, Component>(databaseManager, Component.ownerPropertySpecification, this, ownerId);
        this.projectsProperty = new NodeListProperty<Project, Component>(databaseManager, Component.projectsPropertySpecification, this);
        this.imsSystemProperty = new NullableNodeProperty<IMSSystem, Component>(databaseManager, Component.imsSystemPropertySpecification, this, imsSystemId);
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
    public static async create(databaseManager: DatabaseManager, name: string, description: string, owner: User,
        createdBy: User, createdAt: Date): Promise<Component> {
        if (name.length > 256) {
            throw new Error("the specified name is too long");
        }
        if (description.length > 65536) {
            throw new Error("the specified description is too long");
        }

        const component = new Component(databaseManager, databaseManager.idGenerator.generateString(), name, description, owner.id, undefined,
            createdBy.id, createdAt, false, createdAt, undefined);
        component.markNew();
        databaseManager.addCachedNode(component);
        await owner.ownedComponentsProperty.add(component);
        return component;
    }

    /**
     * marks this node as deleted
     * this also marks this node as changed
     */
    public async markDeleted(): Promise<void> {
        if(!this.isDeleted) {
            await super.markDeleted();
            await this.ownerProperty.markDeleted();
            await Promise.all((await this.interfacesProperty.getElements()).map(componentInterface => componentInterface.markDeleted()));
            await this.pinnedIssuesProperty.clear();
            await this.labelsProperty.clear();
            await this.consumedInterfacesProperty.clear();
            const imsSystem = await this.ims();
            await this.imsSystemProperty.set(undefined);
            if (imsSystem) {
                await imsSystem.markDeleted();
            }
            await this.issuesOnLocationProperty.clear();
            const issues = await this.issuesProperty.getPublicElements();
            await Promise.all(issues.map(async issue => {
                if ((await issue.componentsProperty.getIds()).length === 1) {
                    await issue.markDeleted();
                } else {
                    try {
                        await issue.removeFromComponent(this, new Date());
                    } catch {
                        log(2, `could not remove issue ${issue.id} from component ${this.id}`);
                    }
                }
            }));
        }
    }
}