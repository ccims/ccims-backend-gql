import { GetWithReloadCommand } from "../database/commands/GetWithReloadCommand";
import { LoadRelationCommand } from "../database/commands/load/LoadRelationCommand";
import { LoadComponentsCommand } from "../database/commands/load/nodes/LoadComponentsCommand";
import { LoadIMSUsersCommand } from "../database/commands/load/nodes/LoadIMSUsersCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { CCIMSNode, CCIMSNodeTableSpecification } from "./CCIMSNode";
import { Component } from "./Component";
import { IMSType } from "./enums/IMSType";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { NodeListProperty } from "./properties/NodeListProperty";
import { NodeListPropertySpecification } from "./properties/NodeListPropertySpecification";
import { NodePropertySpecification } from "./properties/NodePropertySpecification";
import { NullableNodeProperty } from "./properties/NullableNodeProperty";
import { IMSUser } from "./IMSUser";

/**
 * interface for connectionData
 */
export interface ConnectionData {

}

/**
 * specification of the table which contains ImsSystems
 */
export const IMSSystemTableSpecification: NodeTableSpecification<IMSSystem>
    = new NodeTableSpecification<IMSSystem>("ims_system", CCIMSNodeTableSpecification,
        RowSpecification.fromProperty("type", "imsType"),
        RowSpecification.fromProperty("endpoint", "endpoint"),
        RowSpecification.fromProperty("connection_data", "connectionData"),
        new RowSpecification("component_id", imsSystem => imsSystem.componentProperty.getId()));

/**
 * An issue management system. This will be an instance of one of the available IMS Types.
 * E.g. One GitHub Repository's issue page.
 */
export class IMSSystem extends CCIMSNode<IMSSystem> {

    /**
     * the type if the ims
     */
    private _imsType: IMSType;

    /**
     * the endpoint used for the ims
     */
    private _endpoint: string;

    /**
     * other data necessary for the ims
     */
    private _connectionData: ConnectionData;

    /**
     * property with the component on which this imsSystem is
     */
    public componentProperty: NullableNodeProperty<Component, IMSSystem>;

    /**
     * specification of the componentProperty
     */
    private static componentPropertySpecification: NodePropertySpecification<Component, IMSSystem>
        = new NodePropertySpecification<Component, IMSSystem>(
            (id, imsSystem) => {
                const command = new LoadComponentsCommand(true);
                command.ids = [id];
                return command;
            },
            imsSystem => {
                return new GetWithReloadCommand(imsSystem, "component_id", new LoadComponentsCommand(true));
            },
            (component, imsSystem) => component.imsSystemProperty
        );

    /**
     * Async getter function for the componentProperty
     * @returns A promise of the component which is using this ims or `undefined` if none
     */
    public async component(): Promise<Component | undefined> {
        return this.componentProperty.getPublic();
    }

    /**
     * list of all IMSUsers with this ImsSystem
     */
    public readonly usersProperty: NodeListProperty<IMSUser, IMSSystem>;

    /**
     * specification for usersProperty 
     */
    private static readonly usersPropertySpecification: NodeListPropertySpecification<IMSUser, IMSSystem>
        = NodeListPropertySpecification.loadDynamic<IMSUser, IMSSystem>(
            LoadRelationCommand.fromManySide("ims_user", "ims_id"),
            (ids, ims) => {
                const command = new LoadIMSUsersCommand();
                command.ids = ids;
                return command;
            },
            ims => {
                const command = new LoadIMSUsersCommand();
                command.imsSystems = [ims.id];
                return command
            })
            .notifyChanged((user, ims) => user.imsSystemProperty)
            .noSave();

    /**
     * warning: this does only create a new ImsSystem instance, but not a new ImsSystem
     * to create a new ImsSystem, use @see Component.create
     * @param databaseManager the databaseManager
     * @param id the id
     * @param imsType the type of the imsSystem
     * @param endpoint the endpoint of the imsSystem
     * @param connectionData the connectionData
     * @param componentId the id of the component on which this ImsSystem is
     */
    public constructor(databaseManager: DatabaseManager, id: string, imsType: IMSType, endpoint: string, connectionData: ConnectionData, componentId?: string) {
        super(NodeType.ImsSystem, databaseManager, IMSSystemTableSpecification, id);
        this._imsType = imsType;
        this._connectionData = connectionData;
        this._endpoint = endpoint;
        this.componentProperty = new NullableNodeProperty<Component, IMSSystem>(databaseManager, IMSSystem.componentPropertySpecification, this, componentId);
        this.usersProperty = new NodeListProperty<IMSUser, IMSSystem>(databaseManager, IMSSystem.usersPropertySpecification, this);
    }

    /**
     * creates a new ImsSystem with the specififed imsType, endpoint and connectionData
     *
     */
    public static create(databaseManager: DatabaseManager, imsType: IMSType, endpoint: string, connectionData: ConnectionData): IMSSystem {
        const imsSystem = new IMSSystem(databaseManager, databaseManager.idGenerator.generateString(), imsType, endpoint, connectionData);
        imsSystem.markNew();
        databaseManager.addCachedNode(imsSystem);
        return imsSystem;
    }

    public get imsType(): IMSType {
        return this._imsType;
    }

    public set imsType(value: IMSType) {
        this.markChanged();
        this._imsType = value;
    }

    public get endpoint(): string {
        return this._endpoint;
    }

    public set endpoint(value: string) {
        this.markChanged();
        this._endpoint = value;
    }

    public get connectionData(): ConnectionData {
        return this._connectionData;
    }

    public set connectionData(value: ConnectionData) {
        this.markChanged();
        this._connectionData = this.connectionData;
    }

    public async markDeleted(): Promise<void> {
        if (!this.isDeleted) {
            await super.markDeleted();
            await this.usersProperty.clear();
            await this.componentProperty.markDeleted();
        }
    }

}