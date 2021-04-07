import { ConnectionData, IMSSystem } from "../../../common/nodes/IMSSystem";
import { SyncAdapter } from "../SyncAdapter";
import { SyncManager } from "../../SyncManager";
import { CCIMSUser } from "../../../common/nodes/CCIMSUser";
import { ImsUserData } from "../../../common/nodes/IMSUser";

/**
 * GitHub SyncAdapter
 */
export const GitHubAdapter: SyncAdapter = {
    tag: "GITHUB",
    description: "GitHub (or GitHub enterprise server) is the IMS for the component",
    canSync: async (ims: IMSSystem) => false,
    sync: async (syncManager: SyncManager) => {
        throw new Error("not implemented yet");
    },
    createsIMSConnectionData: async (data: ConnectionData) => {
        throw new Error("not implemented yet");
    },
    linkUser: async (user: CCIMSUser, data: ImsUserData) => {
        throw new Error("not implemented yet");
    }
}