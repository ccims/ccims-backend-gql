import { LoadRelationCommand } from "../database/commands/load/LoadRelationCommand";
import { LoadComponentInterfacesCommand } from "../database/commands/load/nodes/LoadComponentInterfacesCommand";
import { LoadIssuesCommand } from "../database/commands/load/nodes/LoadIssuesCommand";
import { LoadProjectsCommand } from "../database/commands/load/nodes/LoadProjectsCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { ComponentInterface } from "./ComponentInterface";
import { Issue } from "./Issue";
import { IssueLocation, issuesOnLocationPropertySpecification } from "./IssueLocation";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { Project } from "./Project";
import { NodeListProperty } from "./properties/NodeListProperty";
import { NodeListPropertySpecification } from "./properties/NodeListPropertySpecification";
import { User } from "./User";
import { Label } from "./Label";
import { LoadLabelsCommand } from "../database/commands/load/nodes/LoadLabelsCommand";
import { NamedSyncNode, NamedSyncNodeTableSpecification } from "./NamedSyncNode";
import { SyncMetadata } from "./SyncMetadata";
import { LoadComponentPermissionsCommand } from "../database/commands/load/nodes/LoadComponentPermissionsCommand";
import { ComponentPermission } from "./ComponentPermission";
import { LoadIMSComponentsCommand } from "../database/commands/load/nodes/LoadIMSComponentsCommand";
import { IMSComponent } from "./IMSComponent";
import { Artifact } from "./Artifact";
import { LoadArtifactsCommand } from "../database/commands/load/nodes/LoadArtifactsCommand";

/**
 * the specification of the table which contains components
 */
export const ComponentTableSpecification: NodeTableSpecification<Component>
    = new NodeTableSpecification<Component>("component", NamedSyncNodeTableSpecification,
        RowSpecification.fromProperty("repository_url", "repositoryURL"));

/**
 * A component known to ccims.
 * component can have issues and can be assigned to multiple projects. (NOTE: One IMS per component)
 */
export class Component extends NamedSyncNode<Component> implements IssueLocation {

    /**
     * The url for the repository containing the code of the component, optional
     */
    private _repositoryURL: string | undefined;

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
        = NodeListPropertySpecification.loadDynamic<Project, Component>(
            LoadRelationCommand.fromSecundary("project", "component"),
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
     * list of all IMSComponent with this Component
     */
    public readonly imsComponentsProperty: NodeListProperty<IMSComponent, Component>;

    /**
     * specification for imsComponentsProperty 
     */
    private static readonly imsComponentsPropertySpecification: NodeListPropertySpecification<IMSComponent, Component>
        = NodeListPropertySpecification.loadDynamic<IMSComponent, Component>(
            LoadRelationCommand.fromManySide("ims_component", "component_id"),
            (ids, ims) => {
                const command = new LoadIMSComponentsCommand();
                command.ids = ids;
                return command;
            },
            ims => {
                const command = new LoadIMSComponentsCommand();
                command.imsSystems = [ims.id];
                return command
            })
            .notifyChanged((user, ims) => user.imsSystemProperty)
            .noSave();

    /**
     * property with all issues
     * do NOT add an issue via this property
     */
    public readonly issuesProperty: NodeListProperty<Issue, Component>;

    /**
     * specification of the issuesProperty
     */
    private static readonly issuesPropertySpecification: NodeListPropertySpecification<Issue, Component>
        = NodeListPropertySpecification.loadDynamic<Issue, Component>(
            LoadRelationCommand.fromPrimary("component", "issue"),
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
        = NodeListPropertySpecification.loadDynamic<Issue, Component>(
            LoadRelationCommand.fromPrimary("component", "pinned_issue"),
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
        = NodeListPropertySpecification.loadDynamic<ComponentInterface, Component>(
            LoadRelationCommand.fromManySide("component_interface", "host_component_id"),
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
     * Property of all labels on this component
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
     * Property of all Artifacts on this component
     */
    public readonly artifactsProperty: NodeListProperty<Artifact, Component>;

    /**
     * Specification for the artifactsProperty
     */
    private static readonly artifactsPropertySpecification: NodeListPropertySpecification<Artifact, Component> = 
        NodeListPropertySpecification.loadDynamic<Artifact, Component>(LoadRelationCommand.fromManySide("artifact", "component_id"),
            (ids, component) => {
                const command = new LoadArtifactsCommand(true);
                command.ids = ids;
                return command;
            },
            (component) => {
                const command = new LoadArtifactsCommand(true);
                command.onComponents = [component.id];
                return command;
            })
            .notifyChanged((artifact, component) => artifact.componentProperty)
            .noSave();

    /**
     * property with all permissions which affect this component
     */
    public readonly permissionsProperty: NodeListProperty<ComponentPermission, Component>;

    /**
     * specification for permissionsProperty
     */
    private static readonly permissionsPropertySpecification: NodeListPropertySpecification<ComponentPermission, Component>
        = NodeListPropertySpecification.loadDynamic<ComponentPermission, Component>(
            LoadRelationCommand.fromManySide("component_permission", "component_id"),
            (ids, node) => {
                const command = new LoadComponentPermissionsCommand();
                command.ids = ids;
                return command;
            },
            node => {
                const command = new LoadComponentPermissionsCommand();
                command.components = [node.id];
                return command;
            }
        )
        .notifyChanged((permission, node) => permission.componentProperty)
        .noSave();


    /**
     * creates a new Component instance
     * note: this does NOT create a actually new component, for this @see Component.create
     * @param databaseManager the databaseManager
     * @param id the id
     * @param name the name of the component
     * @param description the description of the component
     * @param lastUpdatedAt the date when the description or name was last updated
     * @param ownerId the id of the owner of the component
     * @param imsSystemId the id of the ims of the component
     */
    public constructor(databaseManager: DatabaseManager, id: string, name: string, description: string, lastUpdatedAt: Date, repositoryURL: string | undefined,
        createdById: string | undefined, createdAt: Date, isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(NodeType.Component, databaseManager, ComponentTableSpecification, id, name, description, lastUpdatedAt, createdById, createdAt, isDeleted, lastModifiedAt, metadata);
        this._repositoryURL = repositoryURL;
        this.projectsProperty = new NodeListProperty<Project, Component>(databaseManager, Component.projectsPropertySpecification, this);
        this.imsComponentsProperty = new NodeListProperty<IMSComponent, Component>(databaseManager, Component.imsComponentsPropertySpecification, this);
        this.issuesOnLocationProperty = new NodeListProperty<Issue, IssueLocation>(databaseManager, issuesOnLocationPropertySpecification, this);
        this.issuesProperty = new NodeListProperty<Issue, Component>(databaseManager, Component.issuesPropertySpecification, this);
        this.interfacesProperty = new NodeListProperty<ComponentInterface, Component>(databaseManager, Component.interfacesPropertySpecification, this);
        this.consumedInterfacesProperty = new NodeListProperty<ComponentInterface, Component>(databaseManager, Component.consumedInterfacesPropertySpecification, this);
        this.pinnedIssuesProperty = new NodeListProperty<Issue, Component>(databaseManager, Component.pinnedIssuesPropertySpecification, this);
        this.labelsProperty = new NodeListProperty<Label, Component>(databaseManager, Component.labelsPropertySpecification, this);
        this.artifactsProperty = new NodeListProperty<Artifact, Component>(databaseManager, Component.artifactsPropertySpecification, this);
        this.permissionsProperty = new NodeListProperty<ComponentPermission, Component>(databaseManager, Component.permissionsPropertySpecification, this);
    }

    /**
     * creates a new component with the specified name, description, owner and a new id
     * also creates the imsSystem for the component with imsType, endpoint and connectionData
     * @param databaseManager
     * @param name the name of the component, must be shorter than 257 chars
     * @param description the description of the component, must be shorter than 65537 chars
     * @param repositoryURL the url where to find the code repository, must be shorter than 65537 chars
     * @param imsType the type of the associated imsSystem
     * @param endpoint the endpoint of the associated imsSystemn
     * @param connectionData the connectionData of the associated imsSystem
     */
    public static async create(databaseManager: DatabaseManager, name: string, description: string, repositoryURL: string | undefined,
        createdBy: User, createdAt: Date): Promise<Component> {
        if (name.length > 256) {
            throw new Error("the specified name is too long");
        }
        if (description.length > 65536) {
            throw new Error("the specified description is too long");
        }
        if (repositoryURL != undefined && repositoryURL.length > 65536) {
            throw new Error("the specified reposityURL is too long");
        }

        const component = new Component(databaseManager, databaseManager.idGenerator.generateString(), name, description, createdAt, repositoryURL,
            createdBy.id, createdAt, false, createdAt, undefined);
        component.markNew();
        databaseManager.addCachedNode(component);
        return component;
    }

    public get repositoryURL(): string | undefined {
        return this._repositoryURL;
    }

    public setRepositoryURL(value: string | undefined, atDate: Date) {
        if (value != undefined && value.length > 65536) {
            throw new Error("reposityUrl is too long, max length = 65536");
        }
        this.markChanged();
        this._repositoryURL = value;
    }
}