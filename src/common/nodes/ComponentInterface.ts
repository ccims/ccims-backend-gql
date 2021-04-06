import { GetWithReloadCommand } from "../database/commands/GetWithReloadCommand";
import { LoadRelationCommand } from "../database/commands/load/LoadRelationCommand";
import { LoadComponentsCommand } from "../database/commands/load/nodes/LoadComponentsCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { Component } from "./Component";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { NodeListProperty } from "./properties/NodeListProperty";
import { NodeListPropertySpecification } from "./properties/NodeListPropertySpecification";
import { NodeProperty } from "./properties/NodeProperty";
import { NodePropertySpecification } from "./properties/NodePropertySpecification";
import { IssueLocation, issuesOnLocationPropertySpecification } from "./IssueLocation";
import { Issue } from "./Issue";
import { NamedSyncNode, NamedSyncNodeTableSpecification } from "./NamedSyncNode";
import { SyncMetadata } from "./SyncMetadata";
import { User } from "./User";

/**
 * the specification of the table which contains components
 */
export const ComponentInterfaceTableSpecification: NodeTableSpecification<ComponentInterface>
    = new NodeTableSpecification<ComponentInterface>("component_interface", NamedSyncNodeTableSpecification,
        new RowSpecification("host_component_id", componentInterface => componentInterface.componentProperty.getId()));

/**
 * a component can have interfaces, which can be locations for issues
 */
export class ComponentInterface extends NamedSyncNode<ComponentInterface> implements IssueLocation {

    /**
     * property for issues which are located on this component
     */
    public readonly issuesOnLocationProperty: NodeListProperty<Issue, IssueLocation>;

    /**
     * property on which component this interface is
     */
    public readonly componentProperty: NodeProperty<Component, ComponentInterface>;

    private static readonly componentPropertySpecification: NodePropertySpecification<Component, ComponentInterface>
        = new NodePropertySpecification<Component, ComponentInterface>(
            (id, componentInterface) => {
                const command = new LoadComponentsCommand(true);
                command.ids = [id];
                return command;
            },
            componentInterface =>  new GetWithReloadCommand(componentInterface, "host_component_id", new LoadComponentsCommand(true)),
            (component, componentInterface) => component.interfacesProperty
        );

    /**
     * Async getter function for the component which offers this component interface
     * @returns A promise of the component that offers this component interface
     */
    public async component(): Promise<Component> {
        return this.componentProperty.getPublic();
    }

    /**
     * property with all componentInterfaces of this component
     */
    public readonly consumedByProperty: NodeListProperty<Component, ComponentInterface>;

    /**
     * specification for consumedByProperty
     */
    private static readonly consumedInterfacesPropertySpecification: NodeListPropertySpecification<Component, ComponentInterface>
        = NodeListPropertySpecification.loadDynamic<Component, ComponentInterface>(LoadRelationCommand.fromSecundary("component", "consumed_component_interface"),
            (ids, componentInterface) => {
                const command = new LoadComponentsCommand(true);
                command.ids = ids;
                return command;
            },
            componentInterface => {
                const command = new LoadComponentsCommand(true);
                command.consumesInterface = [componentInterface.id];
                return command;
            })
            .notifyChanged((component, componentInterface) => component.consumedInterfacesProperty)
            .noSave();


    /**
     * abstract constructor for subclasses
     * @param databaseManager the databaseManager
     * @param id the id of the ComponentInterface
     * @param name the name of the ComponentInterface
     * @param description the description of the ComponentInterface
     * @param createdById The creator users ID
     * @param createdAt The date the ComponentInterface was created
     * @param isDeleted Weather this ComponentInterface is deleted (needed for sync)
     * @param metadata The metadate of this labComponentInterfaceel for syncing
     */
    public constructor(databaseManager: DatabaseManager, id: string, name: string, description: string, componentId: string, createdById: string | undefined, createdAt: Date,
        isDeleted: boolean, lastModifiedAt: Date, metadata?: SyncMetadata) {
        super(NodeType.ComponentInterface, databaseManager, ComponentInterfaceTableSpecification, id, name, description, createdById, createdAt, isDeleted, lastModifiedAt, metadata);
        this.componentProperty = new NodeProperty<Component, ComponentInterface>(databaseManager, ComponentInterface.componentPropertySpecification, this, componentId);
        this.consumedByProperty = new NodeListProperty<Component, ComponentInterface>(databaseManager, ComponentInterface.consumedInterfacesPropertySpecification, this);
        this.issuesOnLocationProperty = new NodeListProperty<Issue, IssueLocation>(databaseManager, issuesOnLocationPropertySpecification, this);
    }

    public static async create(databaseManager: DatabaseManager, name: string, description: string, component: Component, 
        createdBy: User, createdAt: Date): Promise<ComponentInterface> {
        if (name.length > 256) {
            throw new Error("The specified name is too long");
        }
        if (description.length > 65536) {
            throw new Error("The specified description is too long");
        }

        const componentInterface = new ComponentInterface(databaseManager, databaseManager.idGenerator.generateString(), name, description, component.id, 
            createdBy.id, createdAt, false, createdAt, undefined);
        componentInterface.markNew();
        databaseManager.addCachedNode(componentInterface);
        await component.interfacesProperty.add(componentInterface);
        await Promise.all((await component.projectsProperty.getPublicElements()).map(async project => {
            await project.interfacesProperty.add(componentInterface);
        }));
        return componentInterface;
    }

}