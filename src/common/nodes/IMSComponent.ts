import { GetWithReloadCommand } from "../database/commands/GetWithReloadCommand";
import { LoadComponentsCommand } from "../database/commands/load/nodes/LoadComponentsCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { CCIMSNode, CCIMSNodeTableSpecification } from "./CCIMSNode";
import { Component } from "./Component";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { NodePropertySpecification } from "./properties/NodePropertySpecification";
import { NullableNodeProperty } from "./properties/NullableNodeProperty";
import { IMSSystem } from "./IMSSystem";
import { LoadIMSSystemsCommand } from "../database/commands/load/nodes/LoadIMSSystemsCommand";
import { LoadIMSComponentsCommand } from "../database/commands/load/nodes/LoadIMSComponentsCommand";

/**
 * specification of the table which contains ImsComponents
 */
export const IMSComponentTableSpecification: NodeTableSpecification<IMSComponent>
    = new NodeTableSpecification<IMSComponent>("ims_component", CCIMSNodeTableSpecification,
        RowSpecification.fromProperty("ims_data", "imsData"),
        new RowSpecification("component_id", imsComponent => imsComponent.componentProperty.getId()),
        new RowSpecification("ims_system_id", imsComponent => imsComponent.imsSystemProperty.getId()));

/**
 * A Component on a IMSSystem, connects an IMSSystem to a Component
 */
export class IMSComponent extends CCIMSNode<IMSComponent> {

    /**
     * other data necessary for the ims
     */
    private _imsData: IMSComponentData;

    /**
     * property with the component on which this imsComponent is
     */
    public componentProperty: NullableNodeProperty<Component, IMSComponent>;

    /**
     * specification of the componentProperty
     */
    private static componentPropertySpecification: NodePropertySpecification<Component, IMSComponent>
        = new NodePropertySpecification<Component, IMSComponent>(
            (id, imsComponent) => {
                const command = new LoadComponentsCommand(true);
                command.ids = [id];
                return command;
            },
            imsComponent => {
                return new GetWithReloadCommand(imsComponent, "component_id", new LoadComponentsCommand(true));
            },
            (component, imsComponent) => component.imsComponentsProperty
        );

    /**
     * Async getter function for the componentProperty
     * @returns A promise of the component which is using this ims or `undefined` if none
     */
    public async component(): Promise<Component | undefined> {
        return this.componentProperty.getPublic();
    }

    /**
     * property with the IMSSystem this IMSComponent is part of
     */
    public imsSystemProperty: NullableNodeProperty<IMSSystem, IMSComponent>;

    /**
     * specification of the imsSystemProperty
     */
    private static imsSystemPropertySpecification: NodePropertySpecification<IMSSystem, IMSComponent>
        = new NodePropertySpecification<IMSSystem, IMSComponent>(
            (id, imsComponent) => {
                const command = new LoadIMSSystemsCommand();
                command.ids = [id];
                return command;
            },
            imsComponent => {
                return new GetWithReloadCommand(imsComponent, "ims_system_id", new LoadIMSSystemsCommand());
            },
            (imsSystem, imsComponent) => imsSystem.imsComponentsProperty
        );

    /**
     * Async getter function for the imsSystemProperty
     * @returns A promise of the IMSSystem
     */
    public async imsSystem(): Promise<IMSSystem | undefined> {
        return this.imsSystemProperty.getPublic();
    }

    /**
     * warning: this does only create a new ImsComponent instance, but not a new ImsComponent
     * to create a new IMSComponent, use @see Component.create
     * @param databaseManager the databaseManager
     * @param id the id
     * @param imsType the type of the imsComponent
     * @param endpoint the endpoint of the imsComponent
     * @param imsData the IMSComponentData
     * @param componentId the id of the component on which this IMSComponent is
     * @param imsSystemId the id of the IMSSystem of which this IMSComponent is part of
     */
    public constructor(databaseManager: DatabaseManager, id: string, componentId: string, imsSystemId: string, imsData: IMSComponentData) {
        super(NodeType.IMSComponent, databaseManager, IMSComponentTableSpecification, id);
        this._imsData = imsData;
        this.componentProperty = new NullableNodeProperty<Component, IMSComponent>(databaseManager, IMSComponent.componentPropertySpecification, this, componentId);
        this.imsSystemProperty = new NullableNodeProperty<IMSSystem, IMSComponent>(databaseManager, IMSComponent.imsSystemPropertySpecification, this, imsSystemId);
    }

    /**
     * creates a new ImsComponent with the specififed imsType, endpoint and IMSData
     */
    public static async create(databaseManager: DatabaseManager, component: Component, imsSystem: IMSSystem, imsData: IMSComponentData): Promise<IMSComponent> {
        if (await IMSComponent.imsComponentAlreadyExists(databaseManager, component, imsSystem)) {
            throw new Error("An IMSComponent with the specified IMS and Component already exists");
        }

        const imsComponent = new IMSComponent(databaseManager, databaseManager.idGenerator.generateString(), component.id, imsSystem.id, imsData);
        imsComponent.markNew();
        databaseManager.addCachedNode(imsComponent);
        await component.imsComponentsProperty.add(imsComponent);
        await imsSystem.imsComponentsProperty.add(imsComponent);
        return imsComponent;
    }

    /**
     * Checks if an IMSComponent with the specified ims and component already exists
     */
    public static async imsComponentAlreadyExists(databaseManager: DatabaseManager, component: Component, imsSystem: IMSSystem): Promise<boolean> {
        const loadImsComponentCommand = new LoadIMSComponentsCommand();
        loadImsComponentCommand.imsSystems = [imsSystem.id];
        loadImsComponentCommand.components = [component.id];
        databaseManager.addCommand(loadImsComponentCommand);
        await databaseManager.executePendingCommands();
        return loadImsComponentCommand.getResult().length > 0;
    }

    public get imsData(): IMSComponentData {
        return this._imsData;
    }

    public set imsData(value: IMSComponentData) {
        this.markChanged();
        this._imsData = value;
    }

    public async markDeleted(): Promise<void> {
        if (!this.isDeleted) {
            await super.markDeleted();
            await this.componentProperty.markDeleted();
            await this.imsSystemProperty.markDeleted();
        }
    }

}

/**
 * interface for IMSData
 */
export interface IMSComponentData {

}