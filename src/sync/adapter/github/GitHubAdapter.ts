import { IMSSystemData, IMSSystem } from "../../../common/nodes/IMSSystem";
import { SyncAdapter } from "../SyncAdapter";
import { SyncManager } from "../../SyncManager";
import { CCIMSUser } from "../../../common/nodes/CCIMSUser";
import { ImsUserData } from "../../../common/nodes/IMSUser";
import { Component } from "../../../common/nodes/Component";
import { IMSComponent, IMSComponentData } from "../../../common/nodes/IMSComponent";

/**
 * GitHub SyncAdapter
 */
export const GitHubAdapter: SyncAdapter = {
    tag: "GITHUB",
    description: "GitHub (or GitHub enterprise server) is the IMS for the component",
    canSync: async (imsComponent: IMSComponent) => false,
    sync: async (syncManager: SyncManager) => {
        throw new Error("not implemented yet");
    },
    createIMSSystemData: async (data: IMSSystemData) => {
        throw new Error("not implemented yet");
    },
    linkUserToIMS: async (user: CCIMSUser, ims: IMSSystem, data: ImsUserData) => {
        throw new Error("not implemented yet");
    },
    linkComponentToIMS: async (component: Component, ims: IMSSystem, data: IMSComponentData) => {
        throw new Error("not implemented yet");
    }
}