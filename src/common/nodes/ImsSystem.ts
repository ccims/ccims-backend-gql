import { GetWithReloadCommand } from "../database/commands/GetWithReloadCommand";
import { LoadComponentsCommand } from "../database/commands/load/nodes/LoadComponentsCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { CCIMSNode, CCIMSNodeTableSpecification } from "./CCIMSNode";
import { Component } from "./Component";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { NodePropertySpecification } from "./properties/NodePropertySpecification";
import { NullableNodeProperty } from "./properties/NullableNodeProperty";

/**
 * enum with all (currently not) supported issue management systems
 */
export enum ImsType {
    GitHub = "GITHUB",
    GitLab = "GITLAB",
    Jira = "JIRA",
    Redmine = "REDMINE",
    CCIMS = "CCIMS"
}

/**
 * interface for connectionData
 */
export interface ConnectionData {

}

/**
 * specification of the table which contains ImsSystems
 */
export const ImsSystemTableSpecification: NodeTableSpecification<ImsSystem>
    = new NodeTableSpecification<ImsSystem>("ims_system", CCIMSNodeTableSpecification,
    RowSpecification.fromProperty("ims_type", "imsType"),
    RowSpecification.fromProperty("endpoint", "endpoint"),
    RowSpecification.fromProperty("connection_data", "connectionData"),
    new RowSpecification("component_id", imsSystem => imsSystem.componentProperty.getId()));

/**
 * An issue management system. This will be an instance of one of the available IMS Types.
 * E.g. One GitHub Repository's issue page.
 */
export class ImsSystem extends CCIMSNode<ImsSystem> {
    /**
     * the type if the ims
     */
    private _imsType: ImsType;

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
    public componentProperty: NullableNodeProperty<Component, ImsSystem>;

    /**
     * specification of the componentProperty
     */
    private static componentPropertySpecification: NodePropertySpecification<Component, ImsSystem>
    = new NodePropertySpecification<Component, ImsSystem>(
        (id, imsSystem) => {
            const command  = new LoadComponentsCommand();
            command.ids = [id];
            return command;
        },
        imsSystem => {
            return new GetWithReloadCommand(imsSystem, "component_id", new LoadComponentsCommand());
        },
        (component, imsSystem) => component.imsSystemProperty
    );

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
    public constructor (databaseManager: DatabaseManager, id: string, imsType: ImsType, endpoint: string, connectionData: ConnectionData, componentId?: string) {
        super(NodeType.ImsSystem, databaseManager, ImsSystemTableSpecification, id);
        this._imsType = imsType;
        this._connectionData = connectionData;
        this._endpoint = endpoint;
        this.componentProperty = new NullableNodeProperty<Component, ImsSystem>(databaseManager, ImsSystem.componentPropertySpecification, this, componentId);
    }

    /**
     * creates a new ImsSystem with the specififed imsType, endpoint and connectionData
     *
     */
    public static create(databaseManager: DatabaseManager, imsType: ImsType, endpoint: string, connectionData: ConnectionData): ImsSystem {
        const imsSystem = new ImsSystem(databaseManager, databaseManager.idGenerator.generateString(), imsType, endpoint, connectionData);
        imsSystem.markNew();
        databaseManager.addCachedNode(imsSystem);
        return imsSystem;
    }

    public get imsType(): ImsType {
        return this._imsType;
    }

    public set imsType(value: ImsType) {
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

}