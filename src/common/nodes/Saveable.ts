import { DatabaseManager } from "../database/DatabaseManager";

/**
 * on a saveable, save should be called when the instance should be saved
 */
export abstract class Saveable {

    private _isChanged: boolean = false;

    protected constructor(protected readonly _databaseManager: DatabaseManager) {

    }

    /**
     * saves this savable
     */
    public save(): void {
        this._isChanged = false;
    };

    public get isChanged() {
        return this._isChanged;
    }

    /**
     * marks this saveable as changed
     */
    public markChanged(): void {
        if (!this._isChanged) {
            this._isChanged = true;
            this._databaseManager.addChanged(this);
        }
    }
}