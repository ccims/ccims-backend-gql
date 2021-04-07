import { LoadRelationCommand } from "../database/commands/load/LoadRelationCommand";
import { LoadIMSUsersCommand } from "../database/commands/load/nodes/LoadIMSUsersCommand";
import { DatabaseManager } from "../database/DatabaseManager";
import { CCIMSNode, CCIMSNodeTableSpecification } from "./CCIMSNode";
import { Component } from "./Component";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";
import { NodeListProperty } from "./properties/NodeListProperty";
import { NodeListPropertySpecification } from "./properties/NodeListPropertySpecification";
import { IMSUser } from "./IMSUser";
import { Adapters } from "../../sync/adapter/SyncAdapters";
import { IMSComponent } from "./IMSComponent";
import { LoadIMSComponentsCommand } from "../database/commands/load/nodes/LoadIMSComponentsCommand";

/**
 * specification of the table which contains ImsSystems
 */
export const IMSSystemTableSpecification: NodeTableSpecification<IMSSystem>
    = new NodeTableSpecification<IMSSystem>("ims_system", CCIMSNodeTableSpecification,
        new RowSpecification("type", imsSystem => Adapters.adapterIdByTag(imsSystem.imsType)),
        RowSpecification.fromProperty("ims_data", "imsData"));

/**
 * An issue management system. This will be an instance of one of the available IMS Types.
 * E.g. One GitHub Repository's issue page.
 */
export class IMSSystem extends CCIMSNode<IMSSystem> {

    /**
     * the type if the ims
     */
    private _imsType: string;

    /**
     * other data necessary for the ims
     */
    private _imsData: IMSSystemData;

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
     * list of all IMSComponent with this ImsSystem
     */
    public readonly imsComponentsProperty: NodeListProperty<IMSComponent, IMSSystem>;

    /**
     * specification for imsComponentsProperty 
     */
    private static readonly imsComponentsPropertySpecification: NodeListPropertySpecification<IMSComponent, IMSSystem>
        = NodeListPropertySpecification.loadDynamic<IMSComponent, IMSSystem>(
            LoadRelationCommand.fromManySide("ims_user", "ims_system_id"),
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
     * warning: this does only create a new ImsSystem instance, but not a new ImsSystem
     * to create a new ImsSystem, use @see Component.create
     * @param databaseManager the databaseManager
     * @param id the id
     * @param imsType the type of the imsSystem
     * @param endpoint the endpoint of the imsSystem
     * @param imsData the IMSSystemData
     * @param componentId the id of the component on which this ImsSystem is
     */
    public constructor(databaseManager: DatabaseManager, id: string, imsType: string, imsData: IMSSystemData) {
        super(NodeType.IMSSystem, databaseManager, IMSSystemTableSpecification, id);
        this._imsType = imsType;
        this._imsData = imsData;
        this.usersProperty = new NodeListProperty<IMSUser, IMSSystem>(databaseManager, IMSSystem.usersPropertySpecification, this);
        this.imsComponentsProperty = new NodeListProperty<IMSComponent, IMSSystem>(databaseManager, IMSSystem.imsComponentsPropertySpecification, this);
    }

    /**
     * creates a new ImsSystem with the specififed imsType, endpoint and IMSData
     */
    public static async create(databaseManager: DatabaseManager, imsType: string, imsData: IMSSystemData): Promise<IMSSystem> {
        const imsSystem = new IMSSystem(databaseManager, databaseManager.idGenerator.generateString(), imsType, imsData);
        imsSystem.markNew();
        databaseManager.addCachedNode(imsSystem);
        return imsSystem;
    }

    public get imsType(): string {
        return this._imsType;
    }

    public set imsType(value: string) {
        this.markChanged();
        this._imsType = value;
    }

    public get imsData(): IMSSystemData {
        return this._imsData;
    }

    public set imsData(value: IMSSystemData) {
        this.markChanged();
        this._imsData = value;
    }

    public async markDeleted(): Promise<void> {
        if (!this.isDeleted) {
            await super.markDeleted();
            await this.usersProperty.clear();
        }
    }

}

/**
 * interface for IMSData
 */
 export interface IMSSystemData {

}