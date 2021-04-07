import { CCIMSUser } from "../../common/nodes/CCIMSUser";
import { ConnectionData, IMSSystem } from "../../common/nodes/IMSSystem";
import { IMSUser, ImsUserData } from "../../common/nodes/IMSUser";
import { SyncManager } from "../SyncManager";

/**
 * Interface which defines a SyncAdapter
 * A SyncAdapter is a class which provides sync functionality for a specific IMS
 * WARNING: this must be stateless: a component is NOT provided
 */
export interface SyncAdapter {
    /**
     * The tag of the IMSType this SyncAdapter creates
     */
    tag: string,
    /**
     * The description of the IMSType this SyncAdapter creates
     */
    description: string,

    /**
     * If true, the IMS can sync
     * should only return true, if it is likely that the sync can be completed
     * @param ims the ims which is synced
     * @returns true if a sync is possible, otherwise false
     */
    canSync(ims: IMSSystem): Promise<boolean>;

    /**
     * Sync the underlaying component using the provided SyncManager
     * @param syncManager provides the component and other sync features
     */
    sync(syncManager: SyncManager): Promise<void>;

    /**
     * Creates the connection data for an IMSSystem from the connection data provided by the api
     * may throw an Exception if the provided data is incorrect
     * @param data the connection data provided by the api
     */
    createsIMSConnectionData(data: ConnectionData): Promise<ConnectionData>;

    /**
     * Creates the ims data for an IMSUser from the ims data provided by the api
     * may throw an Exception if the provided data is incorrect
     * @param data the ims data provided by the api
     * @returns the created or updated IMSUser
     */
    linkUser(user: CCIMSUser, data: ImsUserData): Promise<IMSUser>;
}