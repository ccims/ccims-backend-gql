import { DatabaseCommand } from "../database/DatabaseCommand";
import { DatabaseManager } from "../database/DatabaseManager";

export interface Saveable {
    /**
     * saves this savable
     */
    save(): void;
}