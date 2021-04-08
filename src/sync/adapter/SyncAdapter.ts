import { CCIMSUser } from "../../common/nodes/CCIMSUser";
import { Component } from "../../common/nodes/Component";
import { IMSComponent, IMSComponentData } from "../../common/nodes/IMSComponent";
import { IMSSystemData, IMSSystem } from "../../common/nodes/IMSSystem";
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
     * @param imsComponent the IMSComponent which is synced (contains both IMSSystem and Component)
     * @returns true if a sync is possible, otherwise false
     */
    canSync(imsComponent: IMSComponent): Promise<boolean>;

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
    createIMSSystemData(data: IMSSystemData): Promise<IMSSystemData>;

    /**
     * Creates the IMSUser from the IMSUserData, user and ims provided by the api
     * may throw an Exception if the provided data is incorrect
     * @param user the CCIMSUser which is linked
     * @param ims the IMSSystem the user is linked to
     * @param data the IMSUserData provided by the api
     * @returns the created or updated IMSUser
     */
    linkUserToIMS(user: CCIMSUser, ims: IMSSystem, data: ImsUserData): Promise<IMSUser>;

    /**
     * Creates the IMSComponent from the IMSComponentData, user and ims provided by the api
     * may throw an Exception if the provided data is incorrect
     * It is guaranteed that currently no IMSComponent with ims and component exists
     * @param component the Component which is linked
     * @param ims the IMSSystem the component is linked to
     * @param data the IMSComponentData provided by the api
     * @returns the created or IMSComponent
     */
    linkComponentToIMS(component: Component, ims: IMSSystem, data: IMSComponentData): Promise<IMSComponent>;
}