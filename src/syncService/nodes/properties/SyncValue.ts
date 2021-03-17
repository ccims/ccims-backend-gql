import { ImsSystem } from "../../../common/nodes/ImsSystem";
import { User } from "../../../common/nodes/User";

export interface SyncValue<T> {
    /**
     * the value
     */
    value: T,
    /**
     * the user who set the value
     */
    asUser?: User,
    /**
     * the date when the value was set
     */
    atDate?: Date,
    /**
     * the ImsSystem on which the value was set
     */
    ims: ImsSystem
}

/**
 * Selects the best SyncValue from a list of SyncValues
 * Priority list: has user, newest date
 * @param values the values from which the best should be selected
 * @returns the best SyncValue in the list
 */
export function findBestSyncValue<T>(values: SyncValue<T>[]): SyncValue<T> {
    const valuesWithUser = values.filter(value => value.asUser !== undefined);
    if (valuesWithUser.length > 0) {
        return findBestSyncValueByDate(valuesWithUser);
    } else {
        return findBestSyncValueByDate(values);
    }
}

/**
 * Selects the best SyncValue from a list of SyncValues
 * Priority list: newest date
 * @param values the values from which the best should be selected
 * @returns the best SyncNode in the list
 */
function findBestSyncValueByDate<T>(values: SyncValue<T>[]): SyncValue<T> {
    values.sort((a, b) => {
        return (b.atDate?.getTime() ?? 0) - (a.atDate?.getTime() ?? 0);
    });
    return values[values.length - 1];
}